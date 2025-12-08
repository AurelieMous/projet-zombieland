import {Box, Typography} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ChatIcon from '@mui/icons-material/Chat';
import SocialCard from "../cards/socialCard.tsx";

const socialNetworks = [
    {
        name: "Facebook",
        link: "https://www.facebook.com/",
        logo: FacebookIcon
    },
    {
        name: "X",
        link: "https://x.com/",
        logo: XIcon
    },
    {
        name: "Youtube",
        link: "https://www.youtube.com/",
        logo: YouTubeIcon
    },
    {
        name: "Instagram",
        link: "https://www.instagram.com/",
        logo: InstagramIcon
    },
    {
        name: "TikTok",
        link: "https://www.tiktok.com/fr/",
        logo: MusicNoteIcon
    },
    {
        name: "Discord",
        link: "https://discord.com/",
        logo: ChatIcon
    }
]

export default function SocialNetwork() {
    return (
        <Box sx={{
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 4
        }}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <Typography variant="h2">
                    Suivez-nous
                </Typography>
            </Box>

            <Box sx={{
                width: { xs: '100%', md: '50%' },
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2
            }}>
                {socialNetworks.map((social) => (
                    <SocialCard
                        key={social.name}
                        name={social.name}
                        link={social.link}
                        logo={social.logo}
                    />
                ))}
            </Box>
        </Box>
    );
}