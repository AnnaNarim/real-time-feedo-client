import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles} from '@material-ui/core/styles';
import {Link, withRouter} from "react-router-dom";
import {SIGN_IN, SIGN_UP} from "../../constant";
import {isAuthenticated} from "../../lib/jsUtils";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
// import AuthenticatedNavBar from "./AuthenticatedNavBar";
// import NonAuthenticatedNavBar from "./NonAuthenticatedNavBar";
import Logo from "../../assets/logo.png";
import AuthenticatedNavBar from "./AuthenticatedNavBar";
import NonAuthenticatedNavBar from "./NonAuthenticatedNavBar";

const useStyles = makeStyles(theme => ({
    appBar         : {
        backgroundColor : "white",
    },
    logoIcon       : {marginRight : '0.5em'},
    menuButton     : {
        marginRight : theme.spacing(2),
    },
    titleContainer : {
        textDecoration : 'none'
    },
    title          : {
        display                      : 'none',
        [theme.breakpoints.up('sm')] : {
            display : 'inline-block',
        },
        color                        : "rgba(48,56,64,.9)",
        fontSize                     : "1.9rem",
        fontWeight                   : 500,
        fontFamily                   : 'Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol'
    },
    toolbarGutters : {
        [theme.breakpoints.up('md')] : {
            margin : theme.spacing(0, 20)
        }
    }
}));


const Header = (props) => {
    const {location, verify} = props;
    const classes = useStyles();
    const isLoginOrSignUpPage = location.pathname.includes(SIGN_UP) || location.pathname.includes(SIGN_IN);

    return (
        <div>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar classes={{gutters : isLoginOrSignUpPage ? classes.toolbarGutters : ''}}>
                    <Box component={Link}
                        className={classes.titleContainer}
                        to={'/'}
                        display="flex"
                        alignItems="center"
                    >
                        <img src={Logo} alt="" width="60px" className={classes.logoIcon}/>
                        <Typography className={classes.title} variant="h6">
                            Real time feedo
                        </Typography>
                    </Box>

                    <Box
                        component='div'
                        display="flex"
                        justifyContent="flex-end"
                        alignItems='center'
                        style={{marginLeft : 'auto'}}
                    >
                        {isAuthenticated() ? <AuthenticatedNavBar/> : <NonAuthenticatedNavBar/>}
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default withRouter(Header);
