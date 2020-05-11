import React, {Fragment} from "react";
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";

const CLASS_PUBLISH_MUTATION = gql`
    mutation publishClass($id: ID!, $published :Boolean!) {
        publishClass(id: $id, published:$published) {
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

const PublishClass = ({published, id, refresh}) => {
    const classes = useStyles();
    const [publishClass, {loading}] = useMutation(CLASS_PUBLISH_MUTATION);

    return <Fragment>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit"/>
        </Backdrop>
        <FormControlLabel
            style={{marginRight : "auto"}}
            control={
                <GreenSwitch
                    size="small"
                    checked={published}
                    onChange={() => {
                        publishClass({variables : {id, published : !published}}).then(() => refresh())
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    color="secondary"
                />
            }
            label="Accept answers"
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
export default PublishClass;
