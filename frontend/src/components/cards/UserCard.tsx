import {Box, Card, CardActions, CardContent, Typography} from "@mui/material";
import type {User} from "../../@types/users";
import {formatDay} from "../../functions/formatDay.ts";
import {PrimaryButton} from "../common";
import {useState} from "react";
import UpdateProfilModal from "../modals/UpdateProfilModal.tsx";

interface UserCardProps {
    user: User;
    // Callback pour rafraichir les données après mise a jour
    onUpdate: () => void;
}

export default function UserCard({user} : UserCardProps) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<"email" | "password">("email");

    const handleOpenEmail = () => {
        setModalType('email');
        setOpen(true);
    };

    const handleOpenPassword = () => {
        setModalType('password');
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    return (
        <Card sx={{ minWidth: 450 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Typography gutterBottom variant="h4">
                    {user.pseudo}
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', pb: 4}}>
                    <Typography variant={"body1"}>
                        Email : {user.email}
                    </Typography>
                    <Typography variant="body2">
                        Crée le : {formatDay(user.created_at)}
                    </Typography><Typography variant="body2">
                    Dernière modification : {formatDay(user.updated_at)}
                </Typography>
                </Box>

            </CardContent>
            <CardActions sx={{display: 'flex', flexDirection: 'column', gap: 5}}>
                <PrimaryButton text={"Modifier l'email"} onClick={handleOpenEmail} fullWidth/>
                <PrimaryButton text={"Modifier le mot de passe"} onClick={handleOpenPassword} fullWidth/>
            </CardActions>
            <UpdateProfilModal
                open={open}
                onClose={handleClose}
                modalType={modalType}
                currentEmail={user.email}
                onUpdateSuccess={onUpdate}
            />
        </Card>

    );
}