import React, { useContext, useEffect, useState } from 'react';
import {
    Box, Button, Paper, TextField, Typography, Divider, Avatar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../index';
import {MAIN_ROUTE, SERVER_URL} from '../utils/consts';
import ConfirmDialog from './ConfirmDialog';
import ChooseCoverDialog from './ChooseCoverDialog';
import Loading from './Loading';
import dayjs from 'dayjs';
import {deleteCourseById, updateCourseById} from "../http/courseAPI";
import {observer} from "mobx-react-lite";

const EditCourseComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { CourseContent, SnackbarStore } = useContext(Context);
    const [name, setName] = useState('');
    const [cover, setCover] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openCoverDialog, setOpenCoverDialog] = useState(false);

    useEffect(() => {
        const course = CourseContent.course;
        if (!course || course.role !== 'creator') {
            navigate(-1);
            return;
        }
        setName(course.name);
        setCover(course.cover);
        setLoading(false);
    }, [CourseContent.course, navigate]);

    const course = CourseContent.course;

    const handleDelete = async () => {
        setLoading(true);
        deleteCourseById(id).then(res=>{
            navigate(MAIN_ROUTE);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    };

    const handleUpdate = async () => {
        const data={
            name,
            cover,
        }
        updateCourseById(id, data).then(res=>{
            CourseContent.course.name = res.name;
            CourseContent.course.cover = res.cover;
            SnackbarStore.show("Course was updated successfully!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setEditing(false);
                setLoading(false);
            })
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Paper elevation={3} sx={{ p: 4, width: "50%" }} borderRadius={4} p={4}>
                <Loading open={loading} />

                <Typography variant="h6" gutterBottom>
                    Course Information
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" mt={1}>Created At:</Typography>
                    <Typography>{dayjs(course.createdAt).format('YYYY-MM-DD')}</Typography>

                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Creator:</Typography>
                        {course.creator ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                    alt={course.creator.name}
                                    src={course.creator.avatar || "https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"}
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="subtitle1">{course.creator.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{course.creator.email}</Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Typography>Unknown</Typography>
                        )}
                    </Box>

                </Box>

                <Divider sx={{ my: 2 }} />

                <TextField
                    label="Course Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={!editing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        component="img"
                        src={`${SERVER_URL}/static/${cover}`}
                        sx={{ width: 250, height: 150, objectFit: 'cover', borderRadius: 1 }}
                    />
                </Box>

                {editing && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpenCoverDialog(true)}
                        sx={{ mb: 2 }}
                    >
                        Choose new cover
                    </Button>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                    {editing ? (
                        <>
                            <Button variant="contained" color="success" onClick={handleUpdate}>
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setName(course.name);
                                    setCover(course.cover);
                                    setEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => setOpenConfirm(true)}>
                                Delete
                            </Button>
                        </>
                    )}
                </Box>

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    title="Delete Course"
                    message="Are you sure you want to delete this course? This action is irreversible."
                />

                <ChooseCoverDialog
                    open={openCoverDialog}
                    setOpen={setOpenCoverDialog}
                    cover={cover}
                    setCover={setCover}
                />
            </Paper>
        </Box>
    );
};

export default EditCourseComponent;
