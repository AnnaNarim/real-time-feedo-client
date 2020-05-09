import React from 'react';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {BLOG, DRAFTS, SIGN_IN, SIGN_UP} from "../../constant";

const NonAuthenticatedNavBar = () => {
    return <div>
        <Button component={Link} to={BLOG}>
            Blog
        </Button>
        <Button component={Link} to={SIGN_IN}>
            Login
        </Button>
        <Button component={Link} to={SIGN_UP}>
            Sign Up
        </Button>
    </div>
};

export default NonAuthenticatedNavBar;
