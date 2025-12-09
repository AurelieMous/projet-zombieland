import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateReservationDto, UpdateReservationStatusDto } from 'src/generated';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  // === CONSTANTS ===
  private readonly RESERVATION_INCLUDE = {
    user: {
      select: {
        id: true,
        email: true,
        pseudo: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    },
    date: true,
    price: true,
  };

  // === HELPERS ===
  /**
   * Formate une réservation avec conversion des dates et champs calculés
   */
  private formatReservationResponse(reservation: any, userRole: string) {
    const formatted: any = {
      ...reservation,
      created_at: reservation.created_at.toISOString(),
      updated_at: reservation.updated_at.toISOString(),
      date: {
        ...reservation.date,
        jour: reservation.date.jour.toISOString(),
        created_at: reservation.date.created_at.toISOString(),
      },
      price: {
        ...reservation.price,
        created_at: reservation.price.created_at.toISOString(),
        updated_at: reservation.price.updated_at.toISOString(),
      },
    };

    // Ajouter user si présent (pas dans findByUserId)
    if (reservation.user) {
      formatted.user = {
        ...reservation.user,
        created_at: reservation.user.created_at.toISOString(),
        updated_at: reservation.user.updated_at.toISOString(),
      };
    }

    // Ajouter les champs calculés
    return {
      ...formatted,
      ...this.calculateCancellationInfo(reservation, userRole),
    };
  }

  // === 1. CREATE - Créer une réservation ===
  async create(dto: CreateReservationDto, userId: number, userRole: string) {
    const { date_id, price_id, tickets_count } = dto;

    // Validation des champs
    if (!date_id || !price_id || !tickets_count || tickets_count <= 0) {
      throw new BadRequestException('Données de réservation invalides');
    }

    // Vérifier que la date de parc existe et est ouverte
    const parkDate = await this.prisma.parkDate.findUnique({
      where: { id: date_id },
    });

    if (!parkDate) {
      throw new NotFoundException(`Date de parc avec l'ID ${date_id} non trouvée`);
    }

    if (!parkDate.is_open) {
      throw new BadRequestException('Le parc est fermé ce jour-là');
    }

      // Vérifier que la date n'est pas dans le passé
    const visitDate = new Date(parkDate.jour);
    visitDate.setHours(0, 0, 0, 0); // Minuit jour de visite
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Minuit aujourd'hui

    if (visitDate < today) {
      throw new BadRequestException(
        'Impossible de réserver pour une date passée'
      );
    }

    // Vérifier que le tarif existe
    const price = await this.prisma.price.findUnique({
      where: { id: price_id },
    });

    if (!price) {
      throw new NotFoundException(`Tarif avec l'ID ${price_id} non trouvé`);
    }

    // Calculer le montant total
    const totalAmount = Number(price.amount) * tickets_count;

    // Générer un numéro de réservation unique
    const reservationNumber = `ZL-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Créer la réservation
    const reservation = await this.prisma.reservation.create({
      data: {
        reservation_number: reservationNumber,
        user_id: userId,
        date_id,
        price_id,
        tickets_count,
        total_amount: totalAmount,
        status: 'PENDING',
      },
      include: this.RESERVATION_INCLUDE,
    });

    return this.formatReservationResponse(reservation, userRole);
  }

  // === 2. FIND BY USER ID - Mes réservations ===
  async findByUserId(userId: number, userRole: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: { user_id: userId },
      include: { date: true, price: true },
      orderBy: { created_at: 'desc' },
    });

    return reservations.map((reservation) =>
      this.formatReservationResponse(reservation, userRole),
    );
  }

  // === 3. FIND ALL - Toutes les réservations (ADMIN) ===
  async findAll(userRole: string = 'ADMIN') {
    const reservations = await this.prisma.reservation.findMany({
      include: this.RESERVATION_INCLUDE,
      orderBy: { created_at: 'desc' },
    });

    return reservations.map((reservation) =>
      this.formatReservationResponse(reservation, userRole),
    );
  }

  // === 4. FIND ONE - Détail d'une réservation ===
  async findOne(id: number, userId: number, userRole: string) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: this.RESERVATION_INCLUDE,
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    // Vérification des droits d'accès
    if (userRole !== 'ADMIN' && reservation.user_id !== userId) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette réservation');
    }

    return this.formatReservationResponse(reservation, userRole);
  }

  // === 5. UPDATE STATUS - Changer le statut (ADMIN) ===
  async updateStatus(id: number, dto: UpdateReservationStatusDto) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de réservation invalide');
    }

    // Vérifier que la réservation existe
    const exists = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    const { status } = dto;

    // Valider le statut
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Statut invalide');
    }

    // Mettre à jour le statut
    const updated = await this.prisma.reservation.update({
      where: { id },
      data: { status },
      include: this.RESERVATION_INCLUDE,
    });

    return this.formatReservationResponse(updated, 'ADMIN');
  }

  // === 6. REMOVE - Annuler/Supprimer réservation (RÈGLE J-10) ===
  async remove(id: number, userId: number, userRole: string) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de réservation invalide');
    }

    // Récupérer la réservation avec la date de visite
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        date: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    // === LOGIQUE ADMIN ===
    if (userRole === 'ADMIN') {
      // L'administrateur peut tout supprimer sans restriction
      await this.prisma.reservation.delete({ where: { id } });
      return {
        message: `Réservation ${id} supprimée avec succès par l'administrateur`,
      };
    }

    // === LOGIQUE CLIENT ===
    // Vérifier que c'est bien SA réservation
    if (reservation.user_id !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas annuler cette réservation',
      );
    }

    // Calculer la différence de jours entre aujourd'hui et la date de visite
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Minuit aujourd'hui

    const visitDate = new Date(reservation.date.jour);
    visitDate.setHours(0, 0, 0, 0); // Minuit jour de visite

    const diffTime = visitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Vérifier la règle J-10
    if (diffDays < 10) {
      throw new ForbiddenException(
        `Annulation impossible : la visite est dans ${diffDays} jour(s). Annulation possible uniquement si la visite est dans plus de 10 jours.`,
      );
    }

    // Supprimer la réservation
    await this.prisma.reservation.delete({ where: { id } });

    return {
      message: `Réservation ${id} annulée avec succès`,
    };
  }

  // À ajouter APRÈS la méthode remove() (ligne ~367)

private calculateCancellationInfo(reservation: any, userRole: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visitDate = new Date(reservation.date.jour);
  visitDate.setHours(0, 0, 0, 0);

  const diffTime = visitDate.getTime() - today.getTime();
  const daysUntilVisit = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // CLIENT peut annuler si >= 10 jours, ADMIN toujours
  const canCancel = userRole === 'ADMIN' || daysUntilVisit >= 10;

  // Date limite = 10 jours avant la visite
  const cancellationDeadline = new Date(visitDate);
  cancellationDeadline.setDate(visitDate.getDate() - 10);

  return {
    can_cancel: canCancel,
    days_until_visit: daysUntilVisit,
    cancellation_deadline: cancellationDeadline.toISOString(),
    };
  }
}