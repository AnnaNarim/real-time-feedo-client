import React, {Fragment, useState} from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {makeStyles} from "@material-ui/core/styles";

const DELETE_MUTATION = gql`
    mutation deletePost($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    backdrop : {
        zIndex : theme.zIndex.drawer + 1,
        margin : "0 !important"
    }
}));

const DeletePost = ({title, id, refresh}) => {
    const classes = useStyles();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deletePost, {loading}] = useMutation(DELETE_MUTATION);

    return <Fragment>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit"/>
        </Backdrop>
        <IconButton color='secondary' onClick={() => setShowConfirmDialog(true)}>
            <DeleteIcon/>
        </IconButton>
        {showConfirmDialog ? <DeletePostConfirmDialog
            title={title}
            onConfirm={() => deletePost({variables : {id}}).then(() => {
                setShowConfirmDialog(false);
                refresh();
            })}
            onClose={() => setShowConfirmDialog(false)}
        /> : null}
    </Fragment>
};

const DeletePostConfirmDialog = ({title, onConfirm, onClose}) => {
    const [open, setOpen] = useState(true);

    const handleCancel = () => {
        setOpen(false);
        onClose();
    };

    const handleOk = () => {
        setOpen(false);
        onConfirm();
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">Delete Room confirmation</DialogTitle>
            <DialogContent dividers>
                Are you sure you want delete {title} post? &#128561;
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="default">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default DeletePost;
