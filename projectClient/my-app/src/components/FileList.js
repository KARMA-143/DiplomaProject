import React from 'react';
import {
    Box,
    Card,
    IconButton,
    Typography
} from "@mui/material";
import { FileIcon, defaultStyles } from 'react-file-icon';
import DownloadIcon from '@mui/icons-material/Download';
import {useParams} from "react-router-dom";
import {downloadCourseFile} from "../http/courseAPI";
import "../styles/FileList.css";
import ClearIcon from '@mui/icons-material/Clear';
import {observer} from "mobx-react-lite";

const FileList = ({ files, isCreate, setFiles }) => {
    const {id} = useParams();

    const getExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const formatSize = (bytes)=>{
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
            i++;
        }
        return `${bytes.toFixed(1)} ${units[i]}`;
    };

    const downloadFile=(file)=>{
        downloadCourseFile(id, file.id)
            .then(data=>{
            const url=URL.createObjectURL(data);
            const anchor=document.createElement("a");
            anchor.href=url;
            anchor.download=file.name;
            document.body.appendChild(anchor);
            anchor.style.display="none";
            anchor.click();
            anchor.remove();
        })
    }

    const removeFile=(index)=>{
        const updated = [...files];
        updated.splice(index,1);
        setFiles(updated);
    }

    return (
        <Box component="div" className={"file-container"}>
            {files.map((file, index) => {
                const ext = getExtension(file.name);
                return (
                    <Card
                        key={index}
                        variant="outlined"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            position: "relative",
                            width: "120px"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 80,
                                width:80,
                                marginBottom: "20px",
                                position: "relative",
                                padding: "10px 10px 0 10px"
                            }}
                        >
                            <FileIcon extension={ext} {...(defaultStyles[ext] || defaultStyles.txt)} />
                            {
                                isCreate?
                                    <IconButton
                                        size={"small"}
                                        onClick={()=>removeFile(index)}
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            backgroundColor: "rgba(255,255,255,0.7)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,1)",
                                            },
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                    :
                                    <IconButton
                                        size={"small"}
                                        onClick={()=>downloadFile(file)}
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            backgroundColor: "rgba(255,255,255,0.7)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,1)",
                                            },
                                        }}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                            }

                        </Box>
                        <Typography sx={{paddingBottom:"5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "80px", textAlign:"center"}} variant="body2">
                            {file.name}
                        </Typography>
                        <Typography sx={{paddingBottom:"5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "80px", textAlign:"center", color: "grey"}} variant="span">
                            {formatSize(file.size)}
                        </Typography>
                    </Card>
                );
            })}
        </Box>
    );
};

export default observer(FileList);
