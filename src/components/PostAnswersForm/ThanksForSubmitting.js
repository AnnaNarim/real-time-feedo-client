import React, {Fragment} from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

const ThanksForSubmitting = () => {

    return <Fragment>
        <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            style={{height : "100%"}}
        >
            <Grid item>
                <Paper elevation={5} style={{padding : 20}}>
                    <Typography style={{margin : 20}} variant='h3' align='center'>Thank you for your response</Typography>
                    <Divider/>
                    <Typography style={{margin : 20}} variant='h5' align='center'>Your response submitted successfully</Typography>
                </Paper>
            </Grid>
        </Grid>
    </Fragment>
};

const TimeIsOut = () => {

    return <Fragment>
        <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            style={{height : "100%"}}
        >
            <Grid item>
                <Paper elevation={5} style={{padding : 20}}>
                    <Typography style={{margin : 20}} variant='h3' align='center'>Oops time is out</Typography>
                    <Divider/>
                    <Typography style={{margin : 20}} variant='h5' align='center'>Sorry room is closed</Typography>
                </Paper>
            </Grid>
        </Grid>
    </Fragment>
};

export {ThanksForSubmitting, TimeIsOut}
