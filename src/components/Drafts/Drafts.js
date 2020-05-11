import React, {Fragment, useState} from 'react'
import Post from '../../components/Post/Post'
import {gql} from 'apollo-boost'
import {useQuery} from "@apollo/react-hooks";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const DRAFTS_QUERY = gql`
    query DraftsQuery {
        drafts {
            id
            content
            title
            published
            author {
                name
            }
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    backdrop : {
        zIndex : theme.zIndex.drawer + 1
    }
}));


const DraftsPage = (props) => {
    const {location} = props,
        {state = {}} = location,
        {shouldRefetch = false} = state;

    const [needRefetch, setNeedRefetch] = useState(shouldRefetch);

    const classes = useStyles();
    const {loading, data = {}, refetch} = useQuery(DRAFTS_QUERY, {
        options : {fetchPolicy : 'network-only',}
    });
    const {drafts = []} = data;

    if(needRefetch) {
        refetch();
        setNeedRefetch(false);
    }

    return (
        <Fragment>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Container>
                <h1>Drafts</h1>
                <GridList cellHeight={"auto"} cols={2} spacing={10}>
                    {drafts.map((draft) => (
                        <GridListTile key={draft.id}>
                            <Post
                                post={draft}
                                refresh={() => refetch()}
                                isPublished={draft.published}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </Container>
        </Fragment>
    )
};

export default withRouter(DraftsPage);
