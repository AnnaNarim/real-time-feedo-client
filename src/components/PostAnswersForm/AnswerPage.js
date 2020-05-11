import React, {Fragment, useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {gql} from "apollo-boost";
import {useLazyQuery} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {makeStyles} from "@material-ui/core/styles";
import {Redirect} from "react-router-dom";

const CLASS_QUERY = gql`
    query ClassQuery($id: ID!) {
        class(id: $id) {
            id
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    backdrop : {
        zIndex : theme.zIndex.drawer + 1
    }
}));

const AnswerPage = () => {
    const classes = useStyles(),
        [classId, setClassId] = useState(''),
        [classInfo, setClassInfo] = useState({isError : false, isValid : false}),
        [checkIsValid, {loading}] = useLazyQuery(CLASS_QUERY, {
            onCompleted : ({class : classInfo}) => setClassInfo({
                isValid : Boolean(classInfo && classInfo.id),
                isError : !Boolean(classInfo && classInfo.id)
            })
        });

    useEffect(() => setClassInfo({isError : false, isValid : false}), [classId]);

    if(classId && classInfo.isValid) {
        return <Redirect to={'/room/' + classId}/>;
    }

    return <Fragment>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit"/>
        </Backdrop>

        <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            style={{height : "100%"}}
        >
            <Grid item>
                <Typography variant={'h3'}> Please specify room ID </Typography>
                <TextField
                    fullWidth
                    margin='normal'
                    variant='outlined'
                    label="Room ID"
                    onChange={({target}) => setClassId(target.value)}
                    error={classInfo.isError}
                    helperText={classInfo.isError ? "Please check room ID" : ''}
                />
                <Button disabled={classInfo.isError} variant='contained' color='primary' onClick={() => checkIsValid({variables : {id : classId}})}>
                    Enter Room
                </Button>
            </Grid>
        </Grid>
    </Fragment>
};

export default AnswerPage
