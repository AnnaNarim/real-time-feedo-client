import React, {Fragment} from 'react'
import {gql} from 'apollo-boost'
import {useQuery} from "@apollo/react-hooks";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Redirect, withRouter} from "react-router-dom";
import DeletePost from "../Post/PostDelete";
import PublishPost from "../Post/PostPublish";
import UpdatePost from "../Post/PostEdit";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {DRAFTS} from "../../constant";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {clone} from "../../lib/jsUtils";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const FIELDS_QUERY = gql`
    query AnswerFormQuery($id: ID!) {
        class(id: $id) {
            id
            name
            post {
                id
                fields{
                    id
                    label
                    type
                }
            }
            published

        }
    }
`;

const useStyles = makeStyles((theme) => ({
    backdrop : {
        zIndex : theme.zIndex.drawer + 1
    },
    root     : {
        padding : '2em'
    }

}));


const SinglePostView = (props) => {
    const {match, history} = props,
        {params = {}} = match,
        {id} = params;

    if(!id)
        return <Redirect to={'/'}/>;


    const classes = useStyles();
    const {loading, data = {}, refetch} = useQuery(FIELDS_QUERY, {
        variables : {id},
        options   : {fetchPolicy : 'network-only'}
    });

    const refresh = () => refetch();

    const {class : postClass = {}} = data;

    if(!postClass)
        return <Redirect to={'/'}/>;


    const {name, post = {}, published, anonymous} = postClass;

    const {fields = []} = post;


    if(published === false) {
        return <h1>Oooops time is out!!</h1>
    }

    return (
        <Container fixed className={classes.root}>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <Typography align='center'>Class {name}</Typography>

            {fields.map(field => {
                return <TextField
                    fullWidth
                    margin='normal'
                    variant="outlined"
                    label={field.label}
                    onChange={({target}) => {
                    }}
                />
            })}

            <Button
                color='primary'
                variant="contained"
            >
                Submit Answers
            </Button>
        </Container>
    )
};

export default withRouter(SinglePostView);
