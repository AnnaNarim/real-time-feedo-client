import React, {useEffect, useState} from 'react'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import PrivateRoute from "./PrivateRoute"
import {AUTH_TOKEN, BLOG, CREATE_NEW_POST, ROOMS, ROOM, SIGN_IN, SIGN_UP, SINGLE_ROOM} from "../../constant";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {isAuthenticated} from "../../lib/jsUtils";
import Layout from "../Layout/Layout";
import {isTokenExpired} from "../../helper/jwtHelper";
import SignInSide from "../Authentication/Login";
import SignUpSide from "../Authentication/SignUp";
import DraftsPage from "../Drafts/Drafts";
import CreatePost from "../CreatePost/CreatePost";
import SinglePostView from "../SinglePostView/SinglePostView";
import PostAnswersForm from "../PostAnswersForm/PostAnswersForm";
import AnswerPage from "../PostAnswersForm/AnswerPage";

// const ME_QUERY = gql`
//   query MeQuery {
//     me {
//       id
//       email
//       name
//     }
//   }
// `;


const Public = () => <h3>Public</h3>;
const Blog = () => <h3>Blog</h3>;
const Protected = () => <h3>Protected</h3>;

const verify = (setToken) => {
    try {
        const token = localStorage.getItem(AUTH_TOKEN);
        if(token !== null && token !== undefined) {
            const expired = isTokenExpired(token);
            if(!expired) {
                setToken(token)
            } else {
                localStorage.removeItem(AUTH_TOKEN);
                setToken(token)
            }
        }
    } catch(e) {
        console.log('')
    }
};


export default function App({token : PropsToken}) {
    const [, setToken] = useState(PropsToken);
    // const {loading, error, data} = useQuery(ME_QUERY);

    useEffect(() => {
        verify(setToken)
    }, []);

    const refreshTokenFn = (token) => {
        if(token) {
            localStorage.setItem(AUTH_TOKEN, token)
        } else {
            localStorage.removeItem(AUTH_TOKEN)
        }
    };

    // if(loading){
    //     return <Backdrop open={true}>
    //         <CircularProgress color="inherit"/>
    //     </Backdrop>
    // }

    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    {/*Example*/}
                    <Route exact path="/public" component={Public}/>
                    <PrivateRoute exact path='/protected' component={Protected}/>

                    <Route exact path='/' component={Public}/>
                    <Route exact path={BLOG} component={Blog}/>
                    <Route exact path={SIGN_IN} render={(props) =>
                        isAuthenticated() ? <Redirect to={'/'}/> :
                            <SignInSide {...props} refreshTokenFn={refreshTokenFn}/>}/>
                    <Route exact path={SIGN_UP} render={(props) =>
                        isAuthenticated() ? <Redirect to={'/'}/> :
                            <SignUpSide {...props} refreshTokenFn={refreshTokenFn}/>}/>

                    <PrivateRoute path={CREATE_NEW_POST} component={CreatePost}/>
                    <PrivateRoute path={ROOMS} component={DraftsPage}/>
                    <PrivateRoute path="/post/:id" component={SinglePostView}/>

                    <Route exact path={ROOM} component={AnswerPage}/>
                    <Route exact path={SINGLE_ROOM} component={PostAnswersForm}/>

                    <Route render={() =>
                        <Paper elevation={15} style={{margin : "20px 10px", padding : "20px 10px"}}>
                            <Typography color='textSecondary' variant={'h1'} align='center'>
                                Error 404
                            </Typography>
                            <Typography color='textSecondary' variant={'h4'} align='center'>
                                Page not found <span role='img' aria-label='hey'>&#128542;</span>
                            </Typography>
                        </Paper>}/>
                </Switch>
            </Layout>
        </BrowserRouter>
    )
}
