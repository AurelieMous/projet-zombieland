import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { email, pseudo, password, confirmPassword } = registerDto;

    // Validation des champs requis
    if (!email || !pseudo || !password || !confirmPassword) {
      throw new BadRequestException('Tous les champs sont requis');
    }

    // Validation de l'email (regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('L\'email n\'est pas valide');
    }

    // Validation du pseudo (3-20 caractères)
    if (pseudo.length < 3 || pseudo.length > 20) {
      throw new BadRequestException(
        'Le pseudo doit contenir entre 3 et 20 caractères',
      );
    }

    // Validation du mot de passe
    // - Minimum 8 caractères
    // - Au moins une majuscule
    // - Au moins un chiffre
    if (password.length < 8) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins une majuscule',
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins un chiffre',
      );
    }

    // Validation: password et confirmPassword doivent correspondre
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Le mot de passe et la confirmation ne correspondent pas',
      );
    }

    // Vérifier si l'email existe déjà
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier si le pseudo existe déjà
    const existingUserByPseudo = await this.prisma.user.findUnique({
      where: { pseudo },
    });

    if (existingUserByPseudo) {
      throw new ConflictException('Ce pseudo est déjà utilisé');
    }

    // Hash du mot de passe avec bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email,
        pseudo,
        password: hashedPassword,
        role: 'CLIENT', // Role par défaut
      },
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
