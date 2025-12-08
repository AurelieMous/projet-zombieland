import {HorairesCard} from "../cards/HorairesCard.tsx";
import {Box, Typography} from "@mui/material";
import AccessCard from "../cards/AccessCard.tsx";
import getHoraireDuJour from "../../functions/getHoraireJour.ts";

export default function InformationsMain() {

    return (
        <Box sx={{
            paddingBottom: { xs: 10, md: 20 },
            paddingTop: { xs: 5, md: 10 },
            paddingX: { xs: 2, sm: 3 }
        }}>
            <Typography
                variant="h2"
                sx={{
                    paddingBottom: { xs: 3, md: 5 },
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textAlign: { xs: 'center', md: 'left' }
                }}
            >
                Informations générales
            </Typography>

            <Box sx={{
                width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
                maxWidth: '1200px',
                margin: '0 auto',
                padding: { xs: 1, sm: 2, md: 3 }
            }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                    gap: { xs: 2, sm: 3, md: 4 }
                }}>
                    <HorairesCard horaire={getHoraireDuJour()} />
                    <AccessCard />
                </Box>
            </Box>
        </Box>
    )
}