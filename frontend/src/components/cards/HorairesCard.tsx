import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import type {IDateParc} from "../../@types/datesParc";

// TODO création des horaires : filtrer sur la date du jour
interface HorairesCardProps {
    horaire: IDateParc
}

export function HorairesCard({horaire}: HorairesCardProps) {

    const formatJour = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
    }

    const formatHeure = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"});
    }

    return (
        <>
            <Card sx={{minWidth: 275}}>
                <CardContent>
                    <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                        Aujourd'hui, {formatJour(horaire.jour)}, le parc est {horaire.is_open ? "ouvert" : "fermé"} :
                    </Typography>
                    {horaire.is_open ? (
                        <>
                            <Typography variant="body2">
                                Heure d'ouverture : {formatHeure(horaire.open_hour)}
                            </Typography>
                            <Typography variant="body2">
                                Heure de fermeture : {formatHeure(horaire.close_hour)}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="h5" component="div">
                            Pas d'horaires disponibles.
                        </Typography>
                    )}
                </CardContent>
                <CardActions>
                    <Button size="small">Plus d'information</Button>
                </CardActions>
            </Card>
        </>
    )
}