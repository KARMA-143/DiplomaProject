import React, {useContext} from 'react';
import {Box, Typography} from "@mui/material";
import {Context} from "../index";
import Post from "./Post";
import NewPostFeed from "./NewPostFeed";
import {observer} from "mobx-react-lite";

const CourseFeed = () => {
    const {CourseContent} = useContext(Context);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{marginBottom: "10px", width: 700, border:"1px solid black", borderRadius: "10px", padding: "5px"}}>
                <NewPostFeed/>
            </Box>
            {
                CourseContent.posts.length > 0 ?
                    CourseContent.posts.map((post, index) => {
                        return <Box sx={{marginBottom:CourseContent.posts.length-1!==index?"10px":"0"}}>
                            <Post post={post} key={post.id}/>
                        </Box>
                    })
                :
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography component={"span"}>Course news and materials will be displayed here</Typography>
                    </Box>
            }
        </Box>
    );
};

export default observer(CourseFeed);