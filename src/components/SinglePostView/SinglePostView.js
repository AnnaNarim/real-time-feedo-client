import React, {Fragment, useState} from 'react'
import {gql} from 'apollo-boost'
import {useQuery} from "@apollo/react-hooks";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Redirect, withRouter} from "react-router-dom";
import DeletePost from "../Post/PostDelete";
import UpdatePost from "../Post/PostEdit";
import {Paper} from "@material-ui/core";
import QrComponent from "./QrComponent";
import {ROOMS} from "../../constant";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import PublishClass from "./ClassPublish";
import Typography from "@material-ui/core/Typography";
import CommentsPageWithData from "./ClassInfoSubscription";

const POST_QUERY = gql`
    query PostQuery($id: ID!) {
        post(id: $id) {
            id
            title
            content
            published
            anonymous
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
    backdrop           : {
        zIndex : theme.zIndex.drawer + 1
    },
    root               : {
        height           : '100%',
        display          : "grid",
        gridTemplateRows : "auto 1fr",
        gridGap          : "2em",
        padding          : "2em"
    },
    topSectionsWrapper : {
        display                        : "grid",
        gridTemplateColumns            : "1fr 1fr",
        gridGap                        : "2em",
        [theme.breakpoints.down('sm')] : {
            gridTemplateColumns : 'auto',
            gridTemplateRows    : "auto auto",
        },
    },
    paper              : {
        padding : theme.spacing(2),
        height  : "100%",
        color   : theme.palette.text.secondary,
    },
    item               : {
        padding : 10
    },
    selectionRoot      : {
        '& .MuiSelect-select' : {
            display             : "grid",
            gridTemplateColumns : "1fr auto",
            gridGap             : "1em"
        },
    },
    sectionPlaceholder : {
        display    : "grid",
        alignItems : 'center',
        height     : "100%"
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

    const [selectedClassId, setSelectedClassId] = useState('');
    const refresh = () => refetch();

    const {post = {}} = data;

    if(!post)
        return <Redirect to={'/'}/>;


    const {title, content, anonymous, classes : postClasses = []} = post;

    return (
        <Fragment>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <div className={classes.root}>
                <div className={classes.topSectionsWrapper}>


                    <Paper className={classes.paper} elevation={6}>
                        <fieldset>
                            <legend>Title</legend>
                            {title}
                        </fieldset>

                        <fieldset>
                            <legend>Content</legend>
                            {content}
                        </fieldset>

                        <div style={{
                            display        : "flex",
                            flexDirection  : "row",
                            justifyContent : 'space-between',
                            alignItems     : "center"
                        }}>
                            <Typography color='textSecondary'>Answers are {!anonymous ? "not" : ''} anonymous</Typography>
                            {/*<PublishPost id={id} isPublished={!!published} refresh={refresh}/>*/}
                            <div>
                                <DeletePost title={title} id={id} refresh={() => history.push({
                                    pathname : ROOMS,
                                    state    : {shouldRefetch : true}
                                })}/>
                                <UpdatePost title={title} id={id} content={content} refresh={() => refresh()}/>
                            </div>
                        </div>


                        {!!postClasses ? <TextField
                                className={classes.selection}
                                select
                                fullWidth
                                label="Select class"
                                value={selectedClassId}
                                name='answerType'
                                classes={{root : classes.selectionRoot}}
                                onChange={({target}) => setSelectedClassId(target.value)}
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

                    <Paper elevation={6} className={classes.paper}>
                        <QrComponent postId={id} selectedClassId={selectedClassId} refresh={() => refresh()}/>
                    </Paper>


                </div>
                <div>
                    <Paper elevation={6} className={classes.paper}>
                        {selectedClassId ? <CommentsPageWithData selectedClassId={selectedClassId}/> :
                            <div className={classes.sectionPlaceholder}>
                                <Typography variant='h2' align='center'>Please select class</Typography>
                            </div>
                        }
                    </Paper>
                </div>
            </div>
        </Fragment>
    )
};

export default withRouter(SinglePostView);
