import React, {Fragment, useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/EditOutlined';
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField/TextField";

const UPDATE_MUTATION = gql`
    mutation updateDraft($id: ID!,$title: String!, $content: String!) {
        updateDraft(id: $id,title : $title, content:$content ) {
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

const UpdatePost = ({title, id, content, refresh}) => {
    const classes = useStyles();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [updateDraft, {loading}] = useMutation(UPDATE_MUTATION);

    return <Fragment>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit"/>
        </Backdrop>
        <IconButton color='primary' onClick={() => setShowConfirmDialog(true)}>
            <EditIcon/>
        </IconButton>
        {showConfirmDialog ? <EditPostConfirmDialog
            title={title}
            content={content}
            onConfirm={(info) => updateDraft({variables : {...info, id}}).then(() => {
                setShowConfirmDialog(false);
                refresh()
            })}
            onClose={() => setShowConfirmDialog(false)}
        /> : null}
    </Fragment>
};

const VALIDATION_INITIAL_STATE = {isValid : true, errorMsgs : {}};

const validateForm = (info) => {
    const errorMsgs = {};
    if(!info.title) {
        errorMsgs.title = 'Title is required field'
    }

    if(!info.content) {
        errorMsgs.content = 'Content is required field'
    }

    return {isValid : !Object.keys(errorMsgs).length, errorMsgs}
};

const EditPostConfirmDialog = ({title : PropsTitle, content : PropsContent, onConfirm, onClose}) => {
    const [open, setOpen] = useState(true);
    const [info, setInfo] = useState({title : PropsTitle, content : PropsContent});
    const [validInfo, setValidInfo] = useState(VALIDATION_INITIAL_STATE);

    const {title, content} = info,
        {errorMsgs = {}} = validInfo;

    useEffect(() => {
        if(!validInfo.isValid) {
            setValidInfo(VALIDATION_INITIAL_STATE)
        }
    }, [info]);

    const handleCancel = () => {
        setOpen(false);
        onClose();
    };

    const handleOk = () => {
        const newValidInfo = validateForm(info);
        if(newValidInfo.isValid === true) {
            onConfirm(info);
            setOpen(false);
        } else {
            setValidInfo(newValidInfo)
        }
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">Edit</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    label="Title"
                    placeholder="Title"
                    error={Boolean(errorMsgs.title)}
                    helperText={Boolean(errorMsgs.title) ? errorMsgs.title : ''}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="content"
                    value={title}
                    name='title'
                    onChange={({target}) => setInfo({...info, [target.name] : target.value})}
                />
                <TextField
                    label="Content"
                    multiline
                    rows={5}
                    rowsMax={10}
                    placeholder="Content"
                    error={Boolean(errorMsgs.content)}
                    helperText={Boolean(errorMsgs.content) ? errorMsgs.content : ''}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="content"
                    value={content}
                    name='content'
                    onChange={({target}) => setInfo({...info, [target.name] : target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="default">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdatePost;
