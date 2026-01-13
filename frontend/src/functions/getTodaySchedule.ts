import { getParkDates} from "../services/parkDates";

const getTodaySchedule = async () => {
    // Utiliser la date locale pour éviter les problèmes de timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    try {
        // Récupérer les dates du parc depuis l'API
        const parkDates = await getParkDates();
        
        // Chercher la date correspondant à aujourd'hui
        const todayParkDate = parkDates.find(
            (parkDate) => parkDate.jour === todayString
        );

        if (todayParkDate) {
            return {
                id: todayParkDate.id,
                jour: new Date(todayParkDate.jour),
                open_hour: today,
                close_hour: today,
                is_open: todayParkDate.is_open,
                notes: todayParkDate.notes || "",
                created_at: new Date(todayParkDate.created_at)
            };
        }

        // Si aucune date trouvée, retourner une donnée par défaut (fermé)
        return {
            id: 0,
            jour: today,
            open_hour: today,
            close_hour: today,
            is_open: false,
            notes: null,
            created_at: today
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des horaires:", error);
        
        // En cas d'erreur, retourner une donnée par défaut
        return {
            id: 0,
            jour: today,
            open_hour: today,
            close_hour: today,
            is_open: false,
            notes: null,
            created_at: today
        };
    }
};

export default getTodaySchedule;