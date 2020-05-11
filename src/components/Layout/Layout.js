import React, {Fragment} from "react";
import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
import {CssBaseline} from '@material-ui/core';
import {SIGN_IN, SIGN_UP} from "../../constant";

import {makeStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";

const useStyles = makeStyles({
    "@global" : {
        'html , body , #root' : {
            height : "100%"
        }
    },
    root      : {
        display          : "grid",
        gridTemplateRows : "64px 1fr",
        height           : '100%'
    }
});

const Layout = (props) => {
    const classes = useStyles();
    const {children, location} = props,
        {pathname = ''} = location;

    if(pathname === SIGN_IN || pathname === SIGN_UP)
        return <Fragment>
            <CssBaseline/>
            {children}
        </Fragment>

    return <div className={classes.root}>
        <CssBaseline/>
        <Header/>
        <div>{children}</div>
    </div>
};

export default withRouter(Layout);
