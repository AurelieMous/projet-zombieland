import {useEffect, useState} from "react";
import {useReservations} from "../../../hooks/useUserReservation.ts";
import {
    Alert,
    Box, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import {colors} from "../../../theme";
import {ReservationCard} from "../../../components/cards";
import {ReservationDetailsModal} from "../../../components/modals";
import WarningIcon from "@mui/icons-material/Warning";
import type {Reservation} from "../../../@types/reservation";
import {deleteReservation} from "../../../services/reservations.ts";

export default function ReservationUserList() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Utilisation d'un hook personnalisé
    const { reservations, setReservations, fetchReservations } = useReservations();
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [reservationToView, setReservationToView] = useState<Reservation | null>(null);

    const handleDelete = (reservation: Reservation) => {
        setReservationToDelete(reservation);
        setDeleteDialogOpen(true);
    }

    const handleViewDetails = (reservation: Reservation) => {
        setReservationToView(reservation);
        setDetailsModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        if(!reservationToDelete) return;

        setIsDeleting(true);
        setError(null);

        try {
            await deleteReservation(reservationToDelete.id);

            // Retirer la réservation supprimée de la liste
            setReservations(reservations.filter(r => r.id !== reservationToDelete.id));

            setDeleteDialogOpen(false);
            setReservationToDelete(null);

            // setSuccessMessage('Réservation supprimée avec succès');

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de la réservation';
            setError(message);
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCloseDeleteDialog = () => {
      if(!isDeleting) {
          setDeleteDialogOpen(false);
          setReservationToDelete(null);
      }
    }

    useEffect(() => {
        const loadReservations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await fetchReservations();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur de chargement');
            } finally {
                setIsLoading(false);
            }
        };
        loadReservations();
    }, [fetchReservations]);

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
                    Mes réservations
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: colors.secondaryGrey,
                    }}
                >
                    Gérez toutes mes réservations sur le parc Zombieland.
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
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onDelete={handleDelete}
                                onClick={handleViewDetails}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Modal de détails */}
            <ReservationDetailsModal
                open={detailsModalOpen}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setReservationToView(null);
                }}
                reservation={reservationToView}
            />

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                maxWidth="sm"
                fullWidth
                disableEscapeKeyDown={isDeleting}
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                            zIndex: (theme) => theme.zIndex.modal + 1,
                        },
                    },
                }}
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    '& .MuiDialog-container': {
                        zIndex: (theme) => theme.zIndex.modal + 1,
                    },
                }}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.secondaryDark,
                        border: `1px solid ${colors.secondaryGrey}`,
                        zIndex: (theme) => theme.zIndex.modal + 1,
                    },
                }}
            >
                <DialogTitle
                    id="delete-dialog-title"
                    sx={{
                        color: colors.primaryRed,
                        fontWeight: 'bold',
                    }}
                >
                    Confirmer la suppression
                </DialogTitle>
                <DialogContent>
                    <Alert
                        severity="warning"
                        icon={<WarningIcon />}
                        sx={{
                            mb: 2,
                            backgroundColor: `${colors.warning}20`,
                            color: colors.white,
                            '& .MuiAlert-icon': {
                                color: colors.warning,
                            },
                        }}
                    >
                        Attention : Cette action est irréversible
                    </Alert>
                    <DialogContentText
                        id="delete-dialog-description"
                        sx={{
                            color: colors.white,
                            fontSize: '1rem',
                            mb: 1,
                        }}
                    >
                        Vous êtes sur le point de supprimer définitivement la réservation{' '}
                        <strong style={{ color: colors.primaryGreen }}>
                            #{reservationToDelete?.reservation_number}
                        </strong>
                        .
                    </DialogContentText>
                    {reservationToDelete && (
                        <DialogContentText
                            sx={{
                                color: colors.secondaryGrey,
                                fontSize: '0.875rem',
                                mt: 1,
                            }}
                        >
                            Client : {reservationToDelete.user?.pseudo || `Utilisateur #${reservationToDelete.user_id}`}
                            <br />
                            Montant : {reservationToDelete.total_amount} €
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        disabled={isDeleting}
                        sx={{
                            color: colors.secondaryGrey,
                            '&:hover': {
                                backgroundColor: `${colors.secondaryGrey}20`,
                            },
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        sx={{
                            color: colors.primaryRed,
                            '&:hover': {
                                backgroundColor: `${colors.primaryRed}20`,
                            },
                        }}
                    >
                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}