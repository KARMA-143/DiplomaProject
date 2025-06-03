import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Paper,
    Menu,
    MenuItem,
    Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';
import {deleteMessage, getChatMessages, sendNewMessage, updateMessage} from "../http/chatAPI";
import { Context } from "../index";
import Loading from "../components/Loading";
import * as uuid from "uuid";
import {socket} from "../socket";

const ChatPage = () => {
    const { userId } = useParams();
    const { SnackbarStore, User } = useContext(Context);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [tempText, setTempText] = useState('');

    useEffect(() => {
        socket.emit("user_connect", User.id);
        getChatMessages(userId)
            .then((r) => {
                setUser(r.user);
                setMessages(r.messages);
            })
            .catch(err => {
                socket.emit("user_disconnect", User.id);
                SnackbarStore.show(err.response?.data?.message || "Failed to load messages", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on("update_chat", (data) => {
            setMessages(prevMessages => {
                const index = prevMessages.findIndex(m => m.id === data.id);
                if (index === -1) return [...prevMessages, data];
                return [
                    ...prevMessages.slice(0, index),
                    data,
                    ...prevMessages.slice(index + 1)
                ];
            });
        });

        socket.on("delete_chat", (data) => {
            console.log(data);
            setMessages(prevMessages => prevMessages.filter(m => m.id !== data));
        });

        return () => {
            socket.off("receive_message");
            socket.off("update_chat");
            socket.off("delete_chat");
        };
    }, []);

    useEffect(()=>{
        console.log(messages);
    },[]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        if (isEdit && selectedMessage) {
            updateMessage(userId, selectedMessage.id, newMessage).then((res) => {
                socket.emit("update_message", {...res, userId});
                setMessages(prevMessages => {
                    const index = prevMessages.findIndex(m => m.id === res.id);
                    if (index === -1) return [...prevMessages, res];
                    return [
                        ...prevMessages.slice(0, index),
                        res,
                        ...prevMessages.slice(index + 1)
                    ];
                });
                SnackbarStore.show("Message updated", "success");
            }).catch(err => {
                SnackbarStore.show(err.response?.data?.message, "error");
            }).finally(() => {
                setIsEdit(false);
                setSelectedMessage(null);
                setNewMessage(tempText);
                setTempText('');
            });
            return;
        }

        const tempId = uuid.v4();
        const message = {
            content: newMessage,
            tempId,
            user: { id: User.id },
            status: "sending..."
        };

        setMessages(prevMessages => [...prevMessages, message]);
        setNewMessage('');

        sendNewMessage(userId, message).then(res => {
            socket.emit("send_message", {...res, userId});
            setMessages(prevMessages => {
                const index = prevMessages.findIndex(m => m.tempId === res.tempId);
                if (index === -1) return [...prevMessages, res];
                return [
                    ...prevMessages.slice(0, index),
                    res,
                    ...prevMessages.slice(index + 1)
                ];
            });
        }).catch(err => {
            SnackbarStore.show(err.response?.data?.message, "error");
        });
    };

    const handleContextMenu = (event, message) => {
        event.preventDefault();
        setSelectedMessage(message);
        setContextMenuAnchor(event.currentTarget);
    };

    const handleCloseContextMenu = () => {
        setContextMenuAnchor(null);
        setSelectedMessage(null);
    };

    const handleEdit = () => {
        handleCloseContextMenu();
        setIsEdit(true);
        setSelectedMessage(selectedMessage);
        setTempText(newMessage);
        setNewMessage(selectedMessage.content)
    };

    const handleCancelEdit = () => {
        setIsEdit(false);
        setSelectedMessage(null);
        setNewMessage(tempText);
    };

    const handleDelete = () => {
        handleCloseContextMenu();
        deleteMessage(userId, selectedMessage.id).then(() => {
            socket.emit("delete_message", {id:selectedMessage.id, userId});
            setMessages(prevMessages => prevMessages.filter(m => m.id !== selectedMessage.id));
            SnackbarStore.show("Message was deleted successfully!", "success");
        }).catch(err => {
            SnackbarStore.show(err.response?.data?.message, "error");
        });
    };

    if (loading) return <Loading open={loading} />;

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <NavBar TitleComponent={<Typography variant="h6">Chat</Typography>} />
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    width: "80%",
                    mx: "auto",
                    my: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    border: '1px solid #ccc',
                    borderRadius: 3,
                    height:"100%",
                    backgroundColor: "#fff",
                    overflow: "hidden"
                }}
            >
                {user && (
                    <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                            alt={user.name}
                            src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"
                            sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <Box>
                            <Typography variant="subtitle1">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Box>
                    </Box>
                )}
                <Divider />
                <Box
                    flexGrow={1}
                    minHeight={0}
                    overflow="auto"
                    mb={2}
                >
                    <Paper sx={{ display: 'flex', flexDirection: 'column', p: 2, flexGrow: 1, minHeight: '100%' }}>
                        {messages.length > 0 ? (
                            <>
                                {messages.map((message) => {
                                    const isOwnMessage = message.user.id !== user.id;
                                    const isCurrentUser = message.user.id === User.id;

                                    return (
                                        <Box
                                            key={message.id || message.tempId}
                                            display="flex"
                                            flexDirection="column"
                                            alignItems={isOwnMessage ? 'flex-end' : 'flex-start'}
                                            mb={1}
                                            sx={{ cursor: isCurrentUser ? 'context-menu' : 'default' }}
                                        >
                                            <Paper
                                                onContextMenu={isCurrentUser ? (e) => handleContextMenu(e, message) : undefined}
                                                sx={{
                                                    p: 1,
                                                    maxWidth: '70%',
                                                    backgroundColor: isOwnMessage ? '#1976d2' : '#f0f0f0',
                                                    color: isOwnMessage ? 'white' : 'black'
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ whiteSpace: 'pre-wrap' }}
                                                >
                                                    {message.content}
                                                </Typography>
                                                <Typography variant="caption" display="block" align="right">
                                                    {message.status
                                                        ? message.status
                                                        : <>
                                                            {dayjs(message.createdAt).format('HH:mm')}
                                                            {message.updatedAt &&
                                                                dayjs(message.updatedAt).isAfter(dayjs(message.createdAt)) && (
                                                                    <> (edited)</>
                                                                )}
                                                        </>
                                                    }
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1} height="100%">
                                <Typography variant="body2" color="text.secondary">
                                    Messages will be displayed here
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>

                <Box display="flex" gap={1} alignItems={"flex-end"}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder={isEdit ? "Edit message..." : "Type a message..."}
                        multiline
                        maxRows={4}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    {isEdit ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSendMessage}>Save</Button>
                            <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>Cancel</Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={handleSendMessage}>Send</Button>
                    )}
                </Box>


                <Menu
                    anchorEl={contextMenuAnchor}
                    open={Boolean(contextMenuAnchor)}
                    onClose={handleCloseContextMenu}
                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                    <MenuItem onClick={handleEdit}>
                        <EditIcon fontSize="small" sx={{ marginRight: 1 }} />
                        Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                        <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                        Delete
                    </MenuItem>
                </Menu>
            </Paper>
        </Box>
    );
};

export default ChatPage;