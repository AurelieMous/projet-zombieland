import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../theme/theme';

interface BackButtonProps {
  text?: string;
  onClick?: () => void;
  href?: string;
}

export const BackButton = ({
  text = 'Retour',
  onClick,
  href,
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      startIcon={<ArrowBackIcon />}
      className="back-button"
      sx={{
        backgroundColor: colors.backButtonBg,
        color: colors.white,
        border: `0.5px solid #CCCCCC`,
        borderRadius: '8px',
        padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
        fontSize: { xs: '0.8rem', md: '0.9rem' },
        fontWeight: 600,
        textTransform: 'uppercase',
        fontFamily: "'Lexend Deca', sans-serif",
        '&:hover': {
          backgroundColor: colors.backButtonBg,
          opacity: 0.8,
          border: `0.5px solid ${colors.primaryGreen}`,
        },
      }}
    >
      {text}
    </Button>
  );
};
