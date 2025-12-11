import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme';
import { useEffect, useState } from 'react';
import type { Reservation } from '../../../@types/reservation';
import { getAllReservations } from '../../../services/reservations';
import { ReservationCard } from '../../../components/cards/ReservationCard';

export const ReservationList = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const reservations = await getAllReservations();
                setReservations(reservations);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des réservations';
                setError(message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReservations();
    }, []);
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        mb: 2,
                    }}
                >
                    Liste des réservations
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: colors.secondaryGrey,
                    }}
                >
                    Gérez toutes les réservations du parc Zombieland.
                </Typography>
            </Box>
            <Box
                sx={{
                    padding: 3,
                    backgroundColor: colors.secondaryDark,
                    border: `1px solid ${colors.secondaryGrey}`,
                    borderRadius: '8px',
                }}
            >
                {isLoading ? (
                    <Typography variant="body1" sx={{ color: colors.white }}>
                        Chargement des réservations...
                    </Typography>
                ) : error ? (
                    <Typography variant="body1" sx={{ color: colors.primaryRed }}>
                        Erreur : {error}
                    </Typography>
                ) : reservations.length === 0 ? (
                    <Typography variant="body1" sx={{ color: colors.white }}>
                        Aucune réservation trouvée.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        {reservations.map((reservation) => (
                            <ReservationCard key={reservation.id} reservation={reservation} />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};