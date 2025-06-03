import React, {useContext} from 'react';
import {Context} from "../index";
import {deletePostComment} from "../http/commentAPI";
import {useParams} from "react-router-dom";
import Comment from "./Comment"

const PostComment = ({comment, editDenied, post, editComment, selectedComment}) => {
    const {CourseContent, SnackbarStore} = useContext(Context);
    const {id} = useParams();

    const deleteComment=()=>{
        deletePostComment(id, comment.id).then(r=>{
            const index = post.comments.findIndex(Comment=>Comment.id===comment.id);
            post.comments.splice(index,1);
            SnackbarStore.show("Comment was deleted!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    }

    return (
        <Comment comment={comment} selectedComment={selectedComment} editDenied={editDenied} role={CourseContent.course.role} deleteComment={deleteComment} editComment={editComment}/>
    );
};

export default PostComment;