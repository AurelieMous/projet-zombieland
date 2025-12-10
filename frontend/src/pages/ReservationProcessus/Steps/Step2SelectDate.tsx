import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Calendar } from "../../../components/common";
import { InformationCard } from "../../../components/cards";
import { colors } from "../../../theme/theme";
import { useReservationStore } from "../../../stores/reservationStore";
import { getParkDates, type ParkDate } from "../../../services/parkDates";

export const Step2SelectDate = () => {
  const { date, dateId, setDate } = useReservationStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date ? new Date(date) : null
  );
  const [parkDates, setParkDates] = useState<ParkDate[]>([]);

  // Récupérer les dates disponibles du parc
  useEffect(() => {
    const fetchParkDates = async () => {
      try {
        const dates = await getParkDates();
        setParkDates(dates);
      } catch (error) {
        console.error('Erreur lors de la récupération des dates:', error);
      }
    };
    fetchParkDates();
  }, []);

  // Synchroniser selectedDate avec le store
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date));
    }
  }, [date]);

  // Re-vérifier le dateId si une date est sélectionnée mais que dateId est undefined
  // et que les parkDates sont maintenant chargées
  useEffect(() => {
    if (date && !dateId && parkDates.length > 0) {
      const dateString = new Date(date).toISOString().split('T')[0];
      const matchingParkDate = parkDates.find(
        parkDate => parkDate.jour === dateString && parkDate.is_open
      );
      
      if (matchingParkDate) {
        setDate(date, matchingParkDate.id);
      }
    }
  }, [date, dateId, parkDates, setDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    // Trouver le dateId correspondant à la date sélectionnée
    // Format de la date pour comparaison : "YYYY-MM-DD"
    const dateString = date.toISOString().split('T')[0];
    
    const matchingParkDate = parkDates.find(
      parkDate => parkDate.jour === dateString && parkDate.is_open
    );
    
    if (matchingParkDate) {
      setDate(date.toISOString(), matchingParkDate.id);
    } else {
      // Si la date n'est pas trouvée ou fermée, on stocke quand même la date mais sans dateId
      // Cela permettra d'afficher une erreur au moment du paiement
      setDate(date.toISOString(), undefined);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontFamily: "'Creepster', cursive",
            color: colors.primaryRed,
          }}
        >
          QUELLE DATE ?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Choisissez votre jour de visite
        </Typography>
      </Box>
      <Calendar 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      
      {selectedDate && (
        <Box sx={{ mt: 4 }}>
          <InformationCard
            icon={<CalendarTodayIcon sx={{ color: colors.primaryGreen }} />}
            title="DATE SÉLECTIONNÉE"
            date={selectedDate}
            borderColor="green"
          />
        </Box>
      )}
    </Box>
  );
};  