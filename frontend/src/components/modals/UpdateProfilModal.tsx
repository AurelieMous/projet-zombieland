import {Box, Modal, Typography} from "@mui/material";
import {getValidateEmail, validateEmail} from "../../functions/validateEmail.ts";
import {useState} from "react";
import {getValidatePassword} from "../../functions/validatePassword.ts";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: 'email' | 'password';
    currentEmail: string;
    onUpdateSuccess: () => void;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function UpdateProfilModal({open, onClose, modalType, currentEmail, onUpdateSuccess}: ModalProps) {

    /// États pour l'email
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    // États pour le mot de passe
    const [currentPassword, setCurrentPassword] = useState(''); // Permet de vérifier si le mot de passe est correct pour changement
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // États communs
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Réinitialiser les champs à la fermeture
    const handleClose = () => {
        setNewEmail('');
        setConfirmEmail('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(null);
        onClose();
    };

    // validation email
    const validateEmail = getValidateEmail(newEmail)

    // validation mot de passe
    const validatePassword = getValidatePassword(newPassword)



    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </Modal>
    );
}
