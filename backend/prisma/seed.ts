import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyage de la base (dans l'ordre des dépendances)
  await prisma.reservation.deleteMany();
  await prisma.attractionImage.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.parkDate.deleteMany();
  await prisma.price.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de données nettoyée');

  // ===== USERS =====
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@zombieland.com',
      pseudo: 'AdminZombie',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'jean@zombieland.com',
      pseudo: 'JeanZ',
      password: hashedPassword,
      role: 'CLIENT',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'marie@zombieland.com',
      pseudo: 'MarieZombie',
      password: hashedPassword,
      role: 'CLIENT',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'paul@zombieland.com',
      pseudo: 'PaulSurvivor',
      password: hashedPassword,
      role: 'CLIENT',
    },
  });

  console.log('✅ Utilisateurs créés (4)');

  // ===== CATEGORIES =====
  const catExtremes = await prisma.category.create({
    data: {
      name: 'Attractions extrêmes',
      description: 'Sensations fortes garanties pour les amateurs d\'adrénaline',
    },
  });

  const catImmersives = await prisma.category.create({
    data: {
      name: 'Expériences immersives',
      description: 'Plongez au cœur de l\'apocalypse zombie',
    },
  });

  const catFamiliales = await prisma.category.create({
    data: {
      name: 'Activités familiales',
      description: 'Des attractions pour toute la famille',
    },
  });

  const catSpectacles = await prisma.category.create({
    data: {
      name: 'Spectacles',
      description: 'Shows et animations en live',
    },
  });

  const catRestauration = await prisma.category.create({
    data: {
      name: 'Restauration',
      description: 'Restaurants et points de vente thématiques',
    },
  });

  console.log('✅ Catégories créées (5)');

  // ===== ATTRACTIONS =====
  const attractionWD = await prisma.attraction.create({
    data: {
      name: 'The Walking Dead Experience',
      description: 'Parcours immersif au cœur de l\'apocalypse zombie avec effets spéciaux et acteurs',
      category_id: catImmersives.id,
    },
  });

  const attractionRide = await prisma.attraction.create({
    data: {
      name: 'Zombie Apocalypse Ride',
      description: 'Montagnes russes extrêmes dans un décor post-apocalyptique',
      category_id: catExtremes.id,
    },
  });

  const attractionMaze = await prisma.attraction.create({
    data: {
      name: 'Labyrinthe des Infectés',
      description: 'Trouvez la sortie avant que les zombies ne vous rattrapent',
      category_id: catFamiliales.id,
    },
  });

  const attractionShow = await prisma.attraction.create({
    data: {
      name: 'Arena des Morts-Vivants',
      description: 'Grand spectacle avec effets pyrotechniques et cascades',
      category_id: catSpectacles.id,
    },
  });

  console.log('✅ Attractions créées (4)');

  // ===== ATTRACTION IMAGES =====
  await prisma.attractionImage.createMany({
    data: [
      {
        attraction_id: attractionWD.id,
        url: 'https://cdn.zombieland.com/images/walking-dead-1.jpg',
        alt_text: 'Vue extérieure de l\'attraction The Walking Dead Experience',
      },
      {
        attraction_id: attractionWD.id,
        url: 'https://cdn.zombieland.com/images/walking-dead-2.jpg',
        alt_text: 'Intérieur sombre avec zombies',
      },
      {
        attraction_id: attractionRide.id,
        url: 'https://cdn.zombieland.com/images/ride-1.jpg',
        alt_text: 'Montagnes russes Zombie Apocalypse',
      },
      {
        attraction_id: attractionMaze.id,
        url: 'https://cdn.zombieland.com/images/maze-1.jpg',
        alt_text: 'Entrée du labyrinthe des infectés',
      },
      {
        attraction_id: attractionShow.id,
        url: 'https://cdn.zombieland.com/images/arena-1.jpg',
        alt_text: 'Arena des Morts-Vivants - vue du spectacle',
      },
    ],
  });

  console.log('✅ Images d\'attractions créées (5)');

  // ===== ACTIVITIES =====
  await prisma.activity.createMany({
    data: [
      {
        name: 'Escape Game Zombie',
        description: '60 minutes pour trouver le remède et sauver l\'humanité',
        category_id: catImmersives.id,
        attraction_id: attractionWD.id,
      },
      {
        name: 'Laser Game Zombie',
        description: 'Affrontez les zombies en équipe avec des lasers',
        category_id: catExtremes.id,
        attraction_id: null,
      },
      {
        name: 'Atelier Maquillage Zombie',
        description: 'Transformez-vous en zombie avec nos maquilleurs professionnels',
        category_id: catFamiliales.id,
        attraction_id: null,
      },
      {
        name: 'Spectacle Survie',
        description: 'Show avec cascades et combats contre les zombies',
        category_id: catSpectacles.id,
        attraction_id: null,
      },
      {
        name: 'Restaurant Le Bunker',
        description: 'Restaurant thématique dans un bunker post-apocalyptique',
        category_id: catRestauration.id,
        attraction_id: null,
      },
    ],
  });

  console.log('✅ Activités créées (5)');

  // ===== PARK DATES =====
  const dates: Array<{
    jour: Date;
    is_open: boolean;
    notes: string | null;
  }> = [];
  const startDate = new Date('2025-12-01');
  
  for (let i = 0; i < 31; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Fermé les lundis et mardis
    const dayOfWeek = currentDate.getDay();
    const isOpen = dayOfWeek !== 1 && dayOfWeek !== 2;
    
    let notes: string | null = null;
    if (currentDate.getDate() === 25) {
      notes = 'Horaires étendus pour Noël (9h-23h)';
    } else if (currentDate.getDate() === 31) {
      notes = 'Soirée spéciale Nouvel An (10h-2h)';
    }
    
    dates.push({
      jour: currentDate,
      is_open: isOpen,
      notes: notes,
    });
  }

  await prisma.parkDate.createMany({ data: dates });

  console.log('✅ Dates d\'ouverture créées (31 jours - décembre 2025)');

  // ===== PRICES (respectant exactement le spec) =====
  const priceEtudiant = await prisma.price.create({
    data: {
      label: 'Tarif Étudiant',
      type: 'ETUDIANT',
      amount: 29.99,
      duration_days: 1,
    },
  });

  const priceAdulte = await prisma.price.create({
    data: {
      label: 'Tarif Adulte',
      type: 'ADULTE',
      amount: 45.00,
      duration_days: 1,
    },
  });

  const priceGroupe = await prisma.price.create({
    data: {
      label: 'Tarif Groupe (10+ personnes)',
      type: 'GROUPE',
      amount: 35.00,
      duration_days: 1,
    },
  });

  const pricePass2j = await prisma.price.create({
    data: {
      label: 'Pass 2 jours',
      type: 'PASS_2J',
      amount: 79.99,
      duration_days: 2,
    },
  });

  const priceGroupe20 = await prisma.price.create({
    data: {
      label: 'Tarif Groupe Premium (20+ personnes)',
      type: 'GROUPE',
      amount: 30.00,
      duration_days: 1,
    },
  });

  console.log('✅ Tarifs créés (5)');

  // ===== RESERVATIONS =====
  const parkDate1 = await prisma.parkDate.findFirst({
    where: { is_open: true },
    orderBy: { jour: 'asc' },
  });

  if (!parkDate1) {
    throw new Error('Aucune date de parc ouverte trouvée');
  }

  const parkDate2 = await prisma.parkDate.findFirst({
    where: { 
      is_open: true,
      jour: { gt: parkDate1.jour }
    },
    orderBy: { jour: 'asc' },
  });

  if (!parkDate2) {
    throw new Error('Pas assez de dates de parc ouvertes trouvées');
  }

  await prisma.reservation.createMany({
    data: [
      {
        reservation_number: `ZL-${Date.now()}-A7F3B`,
        user_id: user1.id,
        date_id: parkDate1.id,
        price_id: priceAdulte.id,
        tickets_count: 2,
        total_amount: 90.00, // 2 x 45.00
        status: 'CONFIRMED',
      },
      {
        reservation_number: `ZL-${Date.now() + 1}-B8G4C`,
        user_id: user2.id,
        date_id: parkDate2.id,
        price_id: priceEtudiant.id,
        tickets_count: 1,
        total_amount: 29.99,
        status: 'PENDING',
      },
      {
        reservation_number: `ZL-${Date.now() + 2}-C9H5D`,
        user_id: user1.id,
        date_id: parkDate2.id,
        price_id: pricePass2j.id,
        tickets_count: 1,
        total_amount: 79.99,
        status: 'CONFIRMED',
      },
      {
        reservation_number: `ZL-${Date.now() + 3}-D1J6E`,
        user_id: user3.id,
        date_id: parkDate1.id,
        price_id: priceGroupe.id,
        tickets_count: 12,
        total_amount: 420.00, // 12 x 35.00
        status: 'CONFIRMED',
      },
    ],
  });

  console.log('✅ Réservations créées (4)');

  console.log('');
  console.log('🎉 Seeding terminé avec succès !');
  console.log('');
  console.log('📊 Résumé :');
  console.log('   - 4 utilisateurs (1 admin, 3 clients)');
  console.log('   - 5 catégories');
  console.log('   - 4 attractions');
  console.log('   - 5 images d\'attractions');
  console.log('   - 5 activités');
  console.log('   - 31 dates d\'ouverture (décembre 2025)');
  console.log('   - 5 tarifs (Étudiant, Adulte, Groupe x2, Pass 2J)');
  console.log('   - 4 réservations');
  console.log('');
  console.log('🔑 Credentials de test :');
  console.log('   Admin   : admin@zombieland.com / password123');
  console.log('   Client 1: jean@zombieland.com / password123');
  console.log('   Client 2: marie@zombieland.com / password123');
  console.log('   Client 3: paul@zombieland.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
