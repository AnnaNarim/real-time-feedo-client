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
import sideImage from '../../assets/image2.jpg';
import {SIGN_UP} from "../../constant";
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/AnnaNarim/">
                ANNA NARIM Production
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const LOGIN_USER_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

export default function SignInSide(props) {
    const {refreshTokenFn, location} = props,
        {state = {}} = location,
        {from = {}} = state;
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [login] = useMutation(LOGIN_USER_MUTATION, {
        onCompleted : ({login}) => {
            if(refreshTokenFn)
                refreshTokenFn(login.token);

            setRedirectToReferrer(true);
            setEmail('');
            setPassword('');
        }
    });

    if(redirectToReferrer) {
        return <Redirect to={from.pathname || "/"}/>
    }

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
                        login({variables : {email, password}})
                    }}>
                        <TextField
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                            onChange={e => setPassword(e.target.value)}
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
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href={SIGN_UP} variant="body2">
                                    {"Don't have an account? Sign Up"}
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
