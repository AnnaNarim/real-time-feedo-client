import {gql} from "apollo-boost";
import React, {useState} from "react";
import {useMutation} from "@apollo/react-hooks";
import {makeStyles} from "@material-ui/core/styles";
import {ROOMS} from "../../constant";
import {Redirect} from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {findFirst} from "../../lib/jsUtils";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {Controller, useFieldArray, useForm} from "react-hook-form";

const CREATE_DRAFT_MUTATION = gql`
    mutation CreateDraftMutation($title: String!,$anonymous:Boolean!, $content: String!, $answerType:String!, $fields:[inputField!]! ) {
        createDraft(title: $title,anonymous: $anonymous content: $content, answerType : $answerType,fields: $fields) {
            id
            title
            content
            answerType
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    submitBtn          : {},
    selection          : {
        margin : "15px 0"
    },
    answerTypesWrapper : {
        display             : "grid",
        gridTemplateColumns : "1fr auto",
        gridGap             : "1em",
        alignItems          : 'baseline'
    },
    fieldWrapper       : {
        display    : "flex",
        alignItems : "center",
        margin     : "5px 0",
        "& > div " : {
            marginRight : 8
        }
    },
    fieldsContainer    : {
        margin : "15px 0"
    }
}));


const CreatePost = (props) => {
    const classes = useStyles();

    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [createDraft] = useMutation(CREATE_DRAFT_MUTATION);

    const {control, reset, handleSubmit, watch, errors} = useForm();
    const {fields, append, remove} = useFieldArray({control, name : "fields"});

    if(redirectToReferrer) {
        return <Redirect to={{
            pathname : ROOMS,
            state    : {shouldRefetch : true}
        }}/>
    }

    const onSubmit = (data) => {
        createDraft({variables : {...data}}).then(() => {
            setRedirectToReferrer(true);
            reset();
        });
    };

    const generalAnswerType = watch("answerType");

    return <Container fixed>
        <h1>Create Room</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                autoFocus
                label="Title"
                placeholder="Title"
                fullWidth
                margin='normal'
                variant="outlined"
                as={TextField}
                rules={{required : true}}
                error={!!errors.title}
                helperText={!!errors.title ? "This field is required" : ''}
                name='title'
                defaultValue={''}
                control={control}
            />

            <Controller
                label="Content"
                placeholder="Content"
                fullWidth
                margin='normal'
                variant="outlined"
                multiline
                rows={5}
                rowsMax={10}
                as={TextField}
                rules={{required : true}}
                error={!!errors.content}
                helperText={!!errors.content ? "This field is required" : ''}
                name='content'
                defaultValue={''}
                control={control}
            />

            <div className={classes.answerTypesWrapper}>
                <Controller
                    label="Select type of the answer"
                    disabled={Boolean(fields.length)}
                    className={classes.selection}
                    margin='normal'
                    variant='outlined'
                    as={TextField}
                    select
                    control={control}
                    onChange={([selected]) => {
                        append({label : "", type : selected.target.value});
                        return selected
                    }}
                    rules={{required : true}}
                    name='answerType'
                    error={!!errors.answerType}
                    helperText={!!errors.answerType ? "This field is required" : 'Please select preferred type of answers'}
                    fullWidth
                    defaultValue={''}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value={"text"}>Text</MenuItem>
                    <MenuItem value={"percentage"}>Percentage</MenuItem>
                    <MenuItem value={"percentageAndText"}>Text and Percentage</MenuItem>
                </Controller>


                <div>
                    <Button disabled={!Boolean(generalAnswerType)} color='primary' variant="contained"
                        onClick={() => append({label : "", type : generalAnswerType})}
                    >
                        Add Field
                    </Button>
                </div>
            </div>


            <div className={classes.fieldsContainer}>
                {fields.map((locationInput, index) => {
                    const type = locationInput.type;
                    const labelName = `fields[${index}].label`;
                    const typeName = `fields[${index}].type`;

                    const hasFieldError = !!(errors.fields && errors.fields.length);

                    const isErrorLabel = hasFieldError ? Boolean(findFirst(errors.fields, {name : labelName})) : false;
                    const isErrorType = hasFieldError ? Boolean(findFirst(errors.fields, {name : typeName})) : false;

                    return (
                        <div key={index} className={classes.fieldWrapper}>
                            <Controller
                                style={{flex : 1}}
                                as={TextField}
                                control={control}
                                name={labelName}
                                defaultValue={locationInput.label}
                                label="Ask a question"
                                placeholder="Ask a question"
                                margin='normal'
                                variant='outlined'
                                rules={{required : true}}
                                error={isErrorLabel}
                                fullWidth
                            />

                            {type === "percentageAndText" ?
                                <Controller
                                    label="Select an answer type"
                                    style={{minWidth : 220}}
                                    margin='normal'
                                    variant='outlined'
                                    as={TextField}
                                    select
                                    control={control}
                                    rules={{required : true}}
                                    name={typeName}
                                    error={isErrorType}
                                    defaultValue={''}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value={'text'}>Text</MenuItem>
                                    <MenuItem value={'percentage'}>Percentage</MenuItem>
                                </Controller>
                                : <Controller
                                    style={{display : "none"}}
                                    as={TextField}
                                    control={control}
                                    name={typeName}
                                    defaultValue={locationInput.type}
                                    label="Ask a question"
                                    placeholder="Ask a question"
                                    margin='normal'
                                    variant='outlined'
                                    disabled={true}
                                />
                            }

                            <IconButton disabled={fields.length === 1} onClick={() => remove(index)}>
                                <DeleteIcon/>
                            </IconButton>
                        </div>
                    );
                })}
            </div>


            <FormControlLabel
                control={
                    <Controller
                        as={Checkbox}
                        control={control}
                        defaultValue={true}
                        name="anonymous" color="primary"/>
                }
                label="Leave answer anonymously"
            />

            <Button className={classes.submitBtn} color='primary' variant="contained" type="submit">
                Create
            </Button>
        </form>
    </Container>;
};
export default CreatePost;
