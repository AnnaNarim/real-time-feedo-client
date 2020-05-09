import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import {Redirect} from "react-router-dom";
import sideImage from '../../assets/image1.jpg';
import {SIGN_IN} from "../../constant";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/AnnaNarim">
                ANNA NARIM Production
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const SIGNUP_USER_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;


const useStyles = makeStyles((theme) => ({
    root   : {
        height : '100vh',
    },
    image  : {
        backgroundImage    : `url(${sideImage})`,
        backgroundRepeat   : 'no-repeat',
        backgroundColor    :
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize     : 'cover',
        backgroundPosition : 'center',
    },
    paper  : {
        margin        : theme.spacing(8, 4),
        display       : 'flex',
        flexDirection : 'column',
        alignItems    : 'center',
    },
    avatar : {
        margin          : theme.spacing(1),
        backgroundColor : theme.palette.secondary.main,
    },
    form   : {
        width     : '100%', // Fix IE 11 issue.
        marginTop : theme.spacing(1),
    },
    submit : {
        margin : theme.spacing(3, 0, 2),
    },
}));

const INITIAL_INFO = {
    email    : '',
    password : '',
    name     : '',
};

export default function SignUpSide(props) {
    const {refreshTokenFn, location} = props,
        {state = {}} = location,
        {from = {}} = state;

    const classes = useStyles();
    const [info, setInfo] = useState(INITIAL_INFO);
    const {name, email, password} = info;

    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [signup] = useMutation(SIGNUP_USER_MUTATION, {
        onCompleted : ({signup}) => {
            if(refreshTokenFn)
                refreshTokenFn(signup.token);

            setRedirectToReferrer(true);
            setInfo(INITIAL_INFO);
        }
    });

    if(redirectToReferrer) {
        return <Redirect to={from.pathname || "/"}/>
    }

    const changeHandler = (e) => setInfo({...info, [e.target.name] : e.target.value});

    return (
        <Grid container component="main" className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={(e) => {
                        e.preventDefault();
                        signup({variables : {...info}})
                    }}>
                        <TextField
                            value={name}
                            onChange={changeHandler}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="User Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            value={email}
                            onChange={changeHandler}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            value={password}
                            onChange={changeHandler}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href={SIGN_IN} variant="body2">
                                    Already have an account!!!
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright/>
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
