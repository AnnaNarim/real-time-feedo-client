import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import {isAuthenticated} from "../../lib/jsUtils";
import {SIGN_IN} from "../../constant";

const PrivateRoute = ({component : Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        isAuthenticated() ? <Component {...props} />
            : <Redirect to={{
                pathname : SIGN_IN,
                state    : {from : props.location}
            }}/>)
    }/>
);

export default PrivateRoute;
