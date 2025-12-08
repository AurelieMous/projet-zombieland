// Fonction pour récupérer l'horaire du jour
import {horaires} from "../../mocks/horaires.ts";
import {HorairesCard} from "../cards/HorairesCard.tsx";

export default function Informations() {

    const getHoraireDuJour = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Chercher l'horaire correspondant au jour d'aujourd'hui
        const horaireTrouve = horaires.horaires.find((horaire) => {
            const horaireDate = new Date(horaire.jour);
            horaireDate.setHours(0, 0, 0, 0);
            return horaireDate.getTime() === today.getTime();
        });

        // Si trouvé, retourner l'horaire, sinon retourner une donnée par défaut
        if (horaireTrouve) {
            return horaireTrouve;
        }

        // Donnée banale pour aujourd'hui si aucun horaire n'existe
        return {
            id: 0,
            jour: today,
            open_hour: today,
            close_hour: today,
            is_open: false,
            notes: "",
            created_at: today
        };
    };

    return (
        <HorairesCard horaire={getHoraireDuJour()} />
    )


}