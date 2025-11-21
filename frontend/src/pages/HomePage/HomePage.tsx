
import VideoBanniere from "../../components/home/VideoBanniere.tsx";
import ImageBanniere from "../../components/home/ImageBanniere.tsx";
import {Box, Typography} from "@mui/material";
import {activitiesData} from "../../mocks/activities.ts";
import ActivityCardHome from "../../components/cards/ActivityCardHome.tsx";
import {Carousel} from "../../components/carousel";


export default function HomePage() {

    const activities = activitiesData.activities;

    const activityCards = activities.map((activite) => (
        <ActivityCardHome
            key={activite.id}
            id={activite.id}
            name={activite.name}
            category={activite.category}
            image={activite.images?.[0]}
        />
    ));

    return (
        <>
            <VideoBanniere/>
            <ImageBanniere/>
            <Box sx={{ pl: 20, pr: 4, pt: 5, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h1" variant="h2" pb={3}>
                    Activités
                </Typography>
                <Carousel
                    items={activityCards}
                    autoPlayInterval={5000}
                    itemsPerPageDesktop={5}
                    itemsPerPageTablet={3}
                    itemsPerPageMobile={2}
                />
            </Box>
        </>
    )
}