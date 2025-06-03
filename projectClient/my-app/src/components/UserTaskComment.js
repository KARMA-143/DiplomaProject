import React, {useContext} from 'react';
import {Context} from "../index";
import {deletePostComment} from "../http/commentAPI";
import {useParams} from "react-router-dom";
import Comment from "./Comment"

const UserTaskComment = ({comment, editDenied, userTask, editComment, selectedComment, setUserTask}) => {
    const {SnackbarStore} = useContext(Context);
    const {id} = useParams();

    const deleteComment=()=>{
        deletePostComment(id, comment.id).then(r=>{
            const index = userTask.comments.findIndex(Comment=>Comment.id===comment.id);
            userTask.comments.splice(index,1);
            const tempObject= {...userTask};
            setUserTask(tempObject);
            SnackbarStore.show("Comment was deleted!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    }

    return (
        <Comment comment={comment} selectedComment={selectedComment} editDenied={editDenied} role={userTask.role} deleteComment={deleteComment} editComment={editComment}/>
    );
};

export default UserTaskComment;