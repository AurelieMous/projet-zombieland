import {useEffect, useState} from "react";
import {getMyReservations} from "../../../services/reservations.ts";

export default function ReservationUserList() {

    const [reservationNumbers, setReservationNumbers] = useState<string[]>([]);

    // Récupérer les réservations de l'utilisateur connecté
    const fetchReservations = async () => {
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
    };

    useEffect(() => {

        fetchReservations();
    }, [reservationNumbers.length]);

    return (
        <div>

        </div>
    )
}