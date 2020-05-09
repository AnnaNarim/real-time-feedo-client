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
import QrComponent from "./QrComponent";
import ChartsComponent from "./ChartsComponent";
import {DRAFTS} from "../../constant";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import PublishClass from "./ClassPublish";

const POST_QUERY = gql`
    query PostQuery($id: ID!) {
        post(id: $id) {
            id
            title
            content
            published
            author {
                name
            }
            classes{
                id
                name
                published
            }
        }
    }
`;


const useStyles = makeStyles((theme) => ({
    backdrop      : {
        zIndex : theme.zIndex.drawer + 1
    },
    root          : {
        height  : '100%',
        padding : theme.spacing(2),
    },
    paper         : {
        padding : theme.spacing(2),
        height  : "100%",
        color   : theme.palette.text.secondary,
    },
    item          : {
        padding : 10
    },
    selectionRoot : {
        '& .MuiTextField-root': {
            display             : "grid",
            gridTemplateColumns : "1fr auto",
            gridGap             : "1em"
        },
    }

}));


const SinglePostView = (props) => {
    const {match, history} = props,
        {params = {}} = match,
        {id} = params;

    if(!id)
        return <Redirect to={'/'}/>;


    const classes = useStyles();
    const {loading, data = {}, refetch} = useQuery(POST_QUERY, {
        variables : {id},
        options   : {fetchPolicy : 'network-only'}
    });

    const refresh = () => refetch();

    const {post = {}} = data;

    if(!post)
        return <Redirect to={'/'}/>;


    const {title, content, published, classes : postClasses = []} = post;

    return (
        <Fragment>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Grid className={classes.root}
                container
                alignItems="stretch"
            >
                <Grid item xs={12} sm={6} className={classes.item}>
                    <Paper className={classes.paper} elevation={6}>
                        <fieldset>
                            <legend>Title</legend>
                            {title}
                        </fieldset>

                        <fieldset>
                            <legend>Content</legend>
                            {content}
                        </fieldset>

                        <div style={{display : "flex", paddingTop : 10}}>
                            <PublishPost id={id} isPublished={!!published} refresh={refresh}/>
                            <DeletePost title={title} id={id} refresh={() => history.push({
                                pathname : DRAFTS,
                                state    : {shouldRefetch : true}
                            })}/>
                            <UpdatePost title={title} id={id} content={content} refresh={() => refresh()}/>
                        </div>


                        {!!postClasses ? <TextField
                                className={classes.selection}
                                select
                                fullWidth
                                label="Select class"
                                // value={answerType}
                                name='answerType'
                                classes={{
                                    root : classes.selectionRoot
                                }}

                                // onChange={({target}) => setInfo({...info, [target.name] : target.value})}
                                variant="outlined"
                                helperText="Please select class to see the answers statistic"
                            >
                                {postClasses.map(({id, name, published}) => (
                                    <MenuItem key={id} value={id} style={{
                                        display             : "grid",
                                        gridTemplateColumns : "1fr auto",
                                        gridGap             : "1em"
                                    }}>
                                        {name}
                                        <PublishClass published={published} id={id} refresh={() => refresh()}/>
                                    </MenuItem>))}
                            </TextField>

                            : null}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.item}>
                    <Paper elevation={6} className={classes.paper}>
                        <QrComponent postId={id}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} className={classes.item}>
                    <Paper elevation={6} className={classes.paper}>
                        <ChartsComponent/>
                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    )
};

export default withRouter(SinglePostView);
