import React, {useState} from 'react'
import {gql} from 'apollo-boost'
import {useMutation, useQuery} from "@apollo/react-hooks";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Redirect, withRouter} from "react-router-dom";
import {ROOM} from "../../constant";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Controller, useForm} from "react-hook-form";
import {ThanksForSubmitting, TimeIsOut} from "./ThanksForSubmitting";

const FIELDS_QUERY = gql`
    query AnswerFormQuery($id: ID!) {
        class(id: $id) {
            id
            name
            post {
                title
                content
                anonymous
                answerType
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

const CREATE_ATTENDEE = gql`            
    mutation CreateAttendee($name:String!, $answers:[inputAnswer!]!, $classId:ID! ) {
        createAttendee(name:$name, answers: $answers ,classId: $classId) {
            id
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
    const {match} = props,
        {params = {}} = match,
        {id} = params;

    const classes = useStyles();
    const {control, handleSubmit, errors} = useForm();
    const {loading, data = {}} = useQuery(FIELDS_QUERY, {
        variables : {id},
        options   : {fetchPolicy : 'network-only'}
    });

    const [createAttendee, {loading : submitting}] = useMutation(CREATE_ATTENDEE);
    const [isSubmitted, setIsSubmitted] = useState(false);


    if(!id)
        return <Redirect to={ROOM}/>;

    const {class : postClass} = data;

    if(loading) {
        return <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress color="inherit"/>
        </Backdrop>
    }

    if(postClass === null || postClass === undefined)
        return <Redirect to={ROOM}/>;


    const {name, post = {}, published} = postClass,
        {fields = [], title, content, anonymous} = post;

    const onSubmit = ({name = "Anonymous", ...fields}) => {
        const answers = Object.keys(fields).reduce((accum, key) => {
            const answer = {field : {id : key}, value : fields[key]};
            accum.push(answer);
            return accum;
        }, []);
        createAttendee({variables : {name : name, createdAt : new Date(), answers, classId : id}})
            .then(() => setIsSubmitted(true));
    };

    if(published === false) {
        return <TimeIsOut/>
    }

    if(isSubmitted) {
        return <ThanksForSubmitting/>
    }

    return (
        <Container fixed className={classes.root}>
            <Backdrop className={classes.backdrop} open={submitting}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <Typography variant='h3' align='center'>Class {name}</Typography>
            <Typography variant='h4' align='left'>{title}</Typography>
            <Typography variant='h6' align='left'> {content}</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                {!anonymous ?
                    <Controller
                        label="Name"
                        fullWidth
                        margin='normal'
                        variant="outlined"
                        as={TextField}
                        rules={{required : true}}
                        error={!!errors.name}
                        helperText={!!errors.name ? "This field is required" : "Please enter name"}
                        name='name'
                        defaultValue={''}
                        control={control}
                    /> : null
                }

                {
                    fields.map(({id, label, type}) => (
                        type === "text" ?
                            <Controller
                            key={id}
                            label={label}
                            margin='normal'
                            variant="outlined"
                            as={TextField}
                            rules={{required : true}}
                            error={!!errors[id]}
                            helperText={!!errors[id] ? "This field is required" : ''}
                            name={id}
                            control={control}
                            fullWidth
                            defaultValue={''}
                            /> :

                            type === 'percentage' ?
                                <Controller
                                    key={id}
                                    margin='normal'
                                    variant='outlined'
                                    as={TextField}
                                    select
                                    label={label}
                                    control={control}
                                    rules={{required : true}}
                                    error={!!errors[id]}
                                    helperText={!!errors[id] ? "This field is required" : ''}
                                    name={id}
                                    fullWidth
                                    defaultValue={''}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value={"0"}>Zero</MenuItem>
                                    <MenuItem value={"10"}>Ten</MenuItem>
                                    <MenuItem value={"20"}>Twenty</MenuItem>
                                    <MenuItem value={"30"}>Thirty</MenuItem>
                                    <MenuItem value={"40"}>Forty</MenuItem>
                                    <MenuItem value={"50"}>Fifty</MenuItem>
                                    <MenuItem value={"60"}>Sixty</MenuItem>
                                    <MenuItem value={"70"}>Seventy</MenuItem>
                                    <MenuItem value={"80"}>Eighty</MenuItem>
                                    <MenuItem value={"90"}>Ninety</MenuItem>
                                    <MenuItem value={"100"}>Hundred</MenuItem>
                                </Controller>
                                : "Cant find current type input"
                    ))}

                <Button color="primary" variant="contained" type="submit" disabled={isSubmitted}>Submit Answers</Button>
            </form>
        </Container>
    )
};

export default withRouter(SinglePostView);
