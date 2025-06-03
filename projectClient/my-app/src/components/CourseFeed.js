import React, {useContext, useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import {Context} from "../index";
import Post from "./Post";
import NewPostFeed from "./NewPostFeed";
import {observer} from "mobx-react-lite";
import {getCoursePosts} from "../http/postAPI";
import {useParams} from "react-router-dom";
import Loading from "./Loading";

const CourseFeed = () => {
    const {CourseContent, SnackbarStore} = useContext(Context);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [editDenied, setEditDenied] = useState(false);

    useEffect(() => {
        getCoursePosts(id).then(res=>{
            CourseContent.posts=res;
        })
            .catch(error=>{
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    },[id, CourseContent, SnackbarStore]);

    if(loading){
        return <Loading />;
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', height:"80vh"}}>
            {
                CourseContent.course.role!=="member" &&
                <Box sx={{marginBottom: "10px", width: 700, border:"1px solid #ccc", borderRadius: "10px", padding: "5px"}}>
                    <NewPostFeed/>
                </Box>
            }
            {
                CourseContent.posts.length > 0 ?
                    CourseContent.posts.map((post, index) => {
                        return <Box sx={{marginBottom:CourseContent.posts.length-1!==index?"10px":"0"}} key={post.id}>
                            <Post post={post} editDenied={editDenied} setEditDenied={setEditDenied}/>
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