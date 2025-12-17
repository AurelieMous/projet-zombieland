import {getMyReservations} from "../services/reservations.ts";
import {useCallback, useState} from "react";

export const useReservations = () => {
    const [reservationNumbers, setReservationNumbers] = useState<string[]>([]);

    const fetchReservations = useCallback(async () => {
        if (reservationNumbers.length > 0) return;

        try {
            const myReservations = await getMyReservations();
            const numbers = myReservations
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(r => r.reservation_number);

            setReservationNumbers(numbers);
        } catch (error) {
            console.error("Impossible de récupérer vos réservations:", error);
        }
    }, [reservationNumbers.length]); // Dépendance pour éviter les appels multiples

    return { reservationNumbers, setReservationNumbers, fetchReservations };
};