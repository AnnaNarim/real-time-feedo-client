import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {BLOG, CREATE_NEW_POST, DRAFTS} from "../../constant";
import {makeStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import {signOut} from "../../lib/jsUtils";


const useStyles = makeStyles((theme) => ({
    root  : {
        width           : '100%',
        maxWidth        : 360,
        backgroundColor : theme.palette.background.paper,
    },
    paper : {
        width     : '80%',
        maxHeight : 435,
    },
}));


const AuthenticatedNavBar = () => {
    const [showLogoutDialog, setShowLogOutDialog] = useState(false);
    return <div>
        <Button component={Link} to={CREATE_NEW_POST}>
            Create New Post
        </Button>
        <Button component={Link} to={DRAFTS}>
            Drafts
        </Button>
        <Button onClick={() => setShowLogOutDialog(true)}>
            Log Out
        </Button>
        {showLogoutDialog ? <LogOutDialog/> : null}
    </div>
};

const LogOutDialog = () => {
    const [open, setOpen] = useState(true);

    const handleCancel = () => {
        setOpen(false)
    };

    const handleOk = () => {
        setOpen(false);
        signOut();
        window.location.href = '/'
        //TODO :implement right log out logic
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">Log Out Confirmation</DialogTitle>
            <DialogContent dividers>
                Are you sure you want to logout? &#128561;
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="default">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="secondary">
                    Log Out
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default AuthenticatedNavBar;
