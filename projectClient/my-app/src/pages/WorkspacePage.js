import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import { observer } from "mobx-react-lite";
import {
    Typography,
    Box,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    MenuItem,
    Select,
    InputLabel, FormControl
} from "@mui/material";
import "../styles/WorkspacePage.css";
import CourseList from "../components/CourseList";

const WorkspacePage = () => {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        setPage(1);
    };

    const handleRoleChange = (e) => {
        setRoleFilter(e.target.value);
        setPage(1);
    };

    return (
        <>
            <NavBar TitleComponent={<Typography variant="h6" component="div">Workspace</Typography>} />

            <Paper
                elevation={3}
                sx={{
                    mt: 3,
                    mx: 'auto',
                    px: 3,
                    py: 2,
                    maxWidth: '900px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 3
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <TextField
                        fullWidth
                        label="Search by course name"
                        variant="outlined"
                        size="small"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={roleFilter}
                            label="Role"
                            onChange={handleRoleChange}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="member">Member</MenuItem>
                            <MenuItem value="mentor">Mentor</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            <CourseList searchQuery={searchQuery} roleFilter={roleFilter} page={page} setPage={setPage} />
        </>
    );
};

export default observer(WorkspacePage);