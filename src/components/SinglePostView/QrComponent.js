import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react'
import {makeStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import QRCode from 'qrcode.react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Typography from "@material-ui/core/Typography";
import {DOMAIN} from "../../constant";

const CREATE_CLASS_MUTATION = gql`
    mutation CreateClasstMutation($name: String!, $postId: ID! ) {
        createClass(name: $name, postId: $postId) {
            id
        }
    }
`;


const useStyles = makeStyles((theme) => ({
    backdrop : {
        zIndex : theme.zIndex.drawer + 1,
        margin : "0 !important"
    },
    appBar   : {
        position : 'relative',
    },
    title    : {
        marginLeft : theme.spacing(2),
        flex       : 1,
    },
    root     : {
        display                        : "grid",
        gridTemplateColumns            : "1fr 1fr",
        gridGap                        : '1em',
        height                         : "100%",
        [theme.breakpoints.down('sm')] : {
            gridTemplateColumns : 'auto',
            gridTemplateRows    : "1fr 1fr",
        }
    }

}));

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const QrComponent = ({postId, selectedClassId, refresh}) => {
    const classes = useStyles();
    const [className, setClassName] = useState('');
    const [keyValue, setKeyValue] = useState('');
    const [createClass, {loading}] = useMutation(CREATE_CLASS_MUTATION);


    useEffect(() => {
        setKeyValue(selectedClassId)
    }, [selectedClassId]);


    const QRvalue = DOMAIN + keyValue;

    return (
        <Fragment>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className={classes.root}>

                <div style={{display : "grid", gridTemplateRows : "1fr 1fr", gridGap : '1em'}}>
                    <TextField
                        label="Class Name"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />

                    <Button
                        disabled={!className}
                        style={{margin : "15px 0"}}
                        color='primary'
                        variant="contained"
                        onClick={() => createClass({
                            variables : {
                                name : className,
                                postId
                            }
                        }).then(({data}) => setKeyValue(data.createClass.id)).then(() => refresh())}>
                        Generate QR and Key
                    </Button>
                    <FullScreenDialog
                        keyValue={keyValue}
                        renderQr={(size) => <QRCode value={QRvalue} size={size} level={'H'}/>}/>
                </div>

                <div style={{
                    display          : "grid",
                    gridTemplateRows : "1fr auto",
                    justifyItems     : "center",
                    alignItems       : "center"
                }}>
                    <QRCode value={QRvalue} level={'H'}/>
                    <Typography variant='h5'>{keyValue}</Typography>
                </div>

            </div>

        </Fragment>
    )

};

export default withRouter(QrComponent);



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenDialog({renderQr, keyValue}) {
    const [open, setOpen] = React.useState(false);
    const [width] = useWindowSize();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const size = width / 2;

    return (
        <div>
            <Button variant="outlined" color="primary" style={{width : "100%"}} onClick={handleClickOpen}>
                Open full-screen QR
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>

                <div style={{
                    height       : "100%",
                    width        : "100%",
                    display      : 'grid',
                    alignItems   : "center",
                    justifyItems : "center",
                    margin       : 10
                }}>
                    {renderQr(size / 1.3)}
                    <Typography variant='h1'>{keyValue}</Typography>
                </div>
            </Dialog>
        </div>
    );
}
