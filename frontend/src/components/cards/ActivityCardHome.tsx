import {Card, CardContent, Chip, Typography, Box} from "@mui/material";
import {colors} from "../../theme";
import {Link} from "react-router-dom";
import {styled} from "@mui/material/styles";

interface ActivityCardHomeProps {
    id: number;
    name: string;
    category: string;
    image?: string;
}

const StyledActivityCard = styled(Card)({
    backgroundColor: colors.secondaryDark,
    border: `1px solid ${colors.secondaryGrey}`,
    width: '250px',
    height: '250px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flexShrink: 0, // Empêche le rétrécissement
    '&:hover': {
        borderColor: colors.primaryGreen,
        transform: 'translateY(-5px)',
        boxShadow: `0 5px 20px ${colors.primaryGreen}40`,
    },
    '&:hover .image-overlay': {
        filter: 'brightness(0.4)',
    },
});

export default function ActivityCardHome({id, name, category, image}: ActivityCardHomeProps) {
    return (
        <Link to={`/activities/${id}`} style={{ textDecoration: 'none' }}>
            <StyledActivityCard>
                {/* Image en arrière-plan */}
                {image && (
                    <Box
                        className="image-overlay"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(0.5)',
                            transition: 'filter 0.3s ease',
                        }}
                    />
                )}

                {/* Contenu par-dessus */}
                <CardContent
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '1.5rem !important',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 1.5,
                            color: '#FFFFFF',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
                    >
                        {name}
                    </Typography>
                    <Chip
                        label={category.toUpperCase()}
                        size="small"
                        sx={{
                            backgroundColor: colors.primaryGreen,
                            color: '#FFFFFF',
                            fontFamily: "'Lexend Deca', sans-serif",
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            width: 'fit-content',
                        }}
                    />
                </CardContent>
            </StyledActivityCard>
        </Link>
    );
}