import React, {Fragment, useState} from 'react';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {toArray} from "../../lib/jsUtils";
import Divider from "@material-ui/core/Divider";

import {makeStyles} from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import CloseIcon from '@material-ui/icons/Close';
import PercentageChart from "./PercentageChart";
import moment from 'moment';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
    appBar : {
        position : 'relative',
    },
    title  : {
        marginLeft : theme.spacing(2),
        flex       : 1,
    },
}));

const renderTextTypeAnswers = (fields, showNames) => {
    return <div>
        {fields.map(field => {
            const answers = toArray(field.relativeClassAnswers);

            return <ExpansionPanel key={field.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{field.label}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display : "block"}}>
                    {
                        answers.map(answer => {
                            return <div key={answer.id} style={{width : '100%', margin : "10px 0"}}>
                                <Typography color='textSecondary'>{answer.value} {
                                    showNames ? `- ${answer.author.name}` : ''
                                }</Typography>

                                <Divider/>
                            </div>
                        })
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        })}
    </div>
};

const renderPercentageTypeAnswers = (fields, submittedFormsCount) => {
    return <PercentageChart fields={fields} submittedFormsCount={submittedFormsCount}/>
};

const renderMixedTypeAnswers = (fields, {submittedFormsCount, showNames}) => {
    const fieldsByType = fields.reduce((accum, field) => {
        const fieldType = field.type;

        if(!accum[fieldType])
            accum[fieldType] = [];

        accum[fieldType].push(field);

        return accum
    }, {});

    return <div style={{display : "grid", gridTemplateColumns : "1fr 1fr", gridGap : "1em"}}>
        {renderTextTypeAnswers(fieldsByType.text, showNames)}
        {renderPercentageTypeAnswers(fieldsByType.percentage, submittedFormsCount)}
    </div>;
};

const ChartsComponent = ({data}) => {

    const [showNames, setShowNames] = useState(false);

    const {class : classInfo = {}} = data,
        {post, attendees = []} = classInfo,
        {answerType, anonymous, fields} = post;

    const submittedFormsCount = attendees.length;

    if(!post)
        return null;

    return <Fragment>
        {!anonymous ? <div style={{margin : 10}}>
            <ShowAttendeesList attendees={attendees}/>
            <FormControlLabel
                style={{marginLeft : 20}}
                control={
                    <Switch
                        checked={showNames}
                        color="primary"
                        onChange={(e) => setShowNames(e.target.checked)}
                    />
                }
                label={"Show answers with attendees` names"}
            />
        </div> : null}
        {
            answerType === "text" ? renderTextTypeAnswers(fields, showNames) :
                answerType === "percentage" ? renderPercentageTypeAnswers(fields, submittedFormsCount) :
                    answerType === "percentageAndText" ? renderMixedTypeAnswers(fields, {
                        submittedFormsCount,
                        showNames
                    }) : null

        }
    </Fragment>
};


export default ChartsComponent


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ShowAttendeesList = ({attendees}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Fragment>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Show Attendees List
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Attendees List
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    {
                        attendees.map(attendee => {
                            return <Fragment key={attendee.id}>
                                <ListItem>
                                    <ListItemText primary={attendee.name} secondary={moment(attendee.createdAt).format('MMMM Do YYYY, HH:mm:ss')}/>
                                </ListItem>
                                <Divider/>
                            </Fragment>
                        })
                    }
                </List>
            </Dialog>
        </Fragment>
    );
};
