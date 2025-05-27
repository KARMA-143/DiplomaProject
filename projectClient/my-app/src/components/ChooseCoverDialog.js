import React, {useContext, useState} from 'react';
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, ImageList, ImageListItem,
} from "@mui/material";
import {Context} from "../index";
import "../styles/ChooseCoverDialog.css";
import {SERVER_URL} from "../utils/consts";

const ChooseCoverDialog = ({open, setOpen, cover, setCover}) => {
    const {Covers}=useContext(Context);
    const [chosenCover, setChosenCover] = useState(cover);
    const handleClose=()=>{
        setChosenCover(cover);
        setOpen(false);
    }

    const changeCover=(item)=>{
        setChosenCover(item);
    }

    const chooseCover=()=>{
        setCover(chosenCover);
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={false}
            fullWidth={false}
            PaperProps={{
                sx: {
                    width: 'auto',
                    maxWidth: 'unset',
                },
            }}
        >
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Choose course cover</DialogTitle>
            <DialogContent>
                <ImageList sx={{ width: 680, height: 580 }} cols={3} rowHeight={164}>
                    {Covers.covers.map((item) => (
                        <ImageListItem key={item} onClick={()=>changeCover(item)}>
                            <img
                                srcSet={`${SERVER_URL}/static/${item}`}
                                src={`${SERVER_URL}/static/${item}`}
                                alt="cover"
                                height={164}
                                width={214}
                                loading="lazy"
                                className={item===chosenCover?"selected-image":""}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={chooseCover}>Select</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChooseCoverDialog;