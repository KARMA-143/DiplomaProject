import React, { useContext, useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Avatar
} from '@mui/material';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { changeUserName } from "../http/userAPI";
import Loading from "./Loading";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const EditUserModal = observer(({ open, onClose }) => {
    const { User, SnackbarStore } = useContext(Context);
    const [name, setName] = useState(User.name);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        changeUserName(name)
            .then(() => {
                User.name = name;
                setIsEditing(false);
                SnackbarStore.show("Name was changed successfully!", "success");
            })
            .catch(err => {
                SnackbarStore(err.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCancel = () => {
        setName(User.name);
        setIsEditing(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Loading open={loading} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
                    <Avatar
                        alt={User.name}
                        src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"
                        sx={{ width: 56, height: 56 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: "column", gap: 2, mb: 2 }}>
                    <TextField
                        label="Email"
                        value={User.email}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                {!isEditing ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={() => setIsEditing(true)} variant="contained">Edit name</Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleCancel} variant="outlined" color="error">Cancel</Button>
                        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
});

export default EditUserModal;
