import React, {Fragment} from "react";
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";

const PUBLISH_MUTATION = gql`
    mutation publish($id: ID!, $published :Boolean!) {
        publish(id: $id, published:$published) {
            id
            published
        }
    }
`;


const useStyles = makeStyles((theme) => ({
    backdrop : {
        zIndex : theme.zIndex.drawer + 1,
        margin : "0 !important"
    }
}));

const PublishPost = ({isPublished, id, refresh}) => {
    const classes = useStyles();
    const [publish, {loading}] = useMutation(PUBLISH_MUTATION);

    return <Fragment>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit"/>
        </Backdrop>
        <FormControlLabel
            style={{marginRight : "auto"}}
            control={
                <GreenSwitch
                    checked={isPublished}
                    onChange={() => {
                        publish({variables : {id, published : !isPublished}}).then(() => {
                            refresh()
                        })
                    }}
                    name="isDraft"
                    color="secondary"
                />
            }
            label="Publish"
        />
    </Fragment>
};


const GreenSwitch = withStyles({
    switchBase : {
        color                : '#fafafa',
        '&$checked'          : {
            color : 'rgb(26,148,49)',
        },
        '&$checked + $track' : {
            backgroundColor : 'rgb(26,148,49)'
        },
    },
    checked    : {},
    track      : {},
})(Switch);
export default PublishPost;
