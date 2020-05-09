import {gql} from "apollo-boost";
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/react-hooks";
import {makeStyles} from "@material-ui/core/styles";
import {DRAFTS} from "../../constant";
import {Redirect} from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {clone} from "../../lib/jsUtils";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

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

const INITIAL_STATE = {
    title      : "",
    content    : '',
    anonymous  : true,
    answerType : 'percentageAndText',
    fields     : []
};

const VALIDATION_INITIAL_STATE = {isValid : true, errorMsgs : {}};

const validateForm = (info) => {
    const errorMsgs = {};
    if(!info.title) {
        errorMsgs.title = 'Title is required field'
    }

    if(!info.content) {
        errorMsgs.content = 'Content is required field'
    }

    if(!info.fields.length) {
        errorMsgs.fields = 'At least one field is required'
    }

    return {isValid : !Object.keys(errorMsgs).length, errorMsgs}
};

const CreatePost = (props) => {
    const classes = useStyles();
    const [info, setInfo] = useState(INITIAL_STATE);
    const [validInfo, setValidInfo] = useState(VALIDATION_INITIAL_STATE);

    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [createDraft] = useMutation(CREATE_DRAFT_MUTATION);

    const answerTypeOptions = [
        {value : 'percentage', label : 'Percentage'},
        {value : 'text', label : 'Text'},
        {value : 'percentageAndText', label : 'Percentage and Text'}
    ];

    const {title, content, answerType, fields, anonymous} = info,
        {isValid, errorMsgs = {}} = validInfo;

    useEffect(() => {
        if(!validInfo.isValid) {
            setValidInfo(VALIDATION_INITIAL_STATE)
        }
    }, [info]);

    if(redirectToReferrer) {
        return <Redirect to={{
            pathname : DRAFTS,
            state    : {shouldRefetch : true}
        }}/>
    }


    return <Container fixed>
        <h1>Create Draft</h1>
        <form onSubmit={(e) => {
            e.preventDefault();
            const newValidInfo = validateForm(info);
            if(newValidInfo.isValid === true) {
                createDraft({variables : {...info}}).then(() => {
                    setRedirectToReferrer(true);
                    setInfo(INITIAL_STATE)
                });
            } else {
                setValidInfo(newValidInfo)
            }
        }}>
            <TextField
                autoFocus
                label="Title"
                placeholder="Title"
                error={Boolean(errorMsgs.title)}
                helperText={Boolean(errorMsgs.title) ? errorMsgs.title : ''}
                fullWidth
                margin="normal"
                variant="outlined"
                type="content"
                value={title}
                name='title'
                onChange={({target}) => setInfo({...info, [target.name] : target.value})}
            />
            <TextField
                label="Content"
                multiline
                rows={5}
                rowsMax={10}
                placeholder="Content"
                error={Boolean(errorMsgs.content)}
                helperText={Boolean(errorMsgs.content) ? errorMsgs.content : ''}
                fullWidth
                margin="normal"
                variant="outlined"
                type="content"
                value={content}
                name='content'
                onChange={({target}) => setInfo({...info, [target.name] : target.value})}
            />

            <div className={classes.answerTypesWrapper}>
                <TextField
                    disabled={fields.length}
                    className={classes.selection}
                    select
                    fullWidth
                    label="Select type of the answer"
                    value={answerType}
                    name='answerType'
                    onChange={({target}) => setInfo({...info, [target.name] : target.value})}
                    variant="outlined"
                    helperText="Please select preferred type of answers"
                >
                    {answerTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                </TextField>


                <div>
                    <Button
                        color='primary'
                        variant="contained"
                        onClick={() => setInfo({
                            ...info,
                            fields : fields.concat([{type : answerType, label : ''}])
                        })}
                    >
                        Add Field
                    </Button>
                </div>
            </div>


            <div className={classes.fieldsContainer}>
                {fields.map((field, index) => {
                    return <div key={index} className={classes.fieldWrapper}>
                        <TextField
                            style={{flex : 1}}
                            placeholder="Question Label"
                            variant="outlined"
                            value={field.label}
                            name='content'
                            onChange={({target}) => {
                                const updatedField = {...field, label : target.value};
                                const updatedFields = clone(fields);
                                updatedFields[index] = updatedField;

                                setInfo({...info, fields : updatedFields})
                            }}
                        />

                        {answerType === "percentageAndText" ?
                            <TextField
                                style={{minWidth : 220}}
                                select
                                label="Select type answer type"
                                value={field.type}
                                onChange={({target}) => {
                                    const updatedField = {...field, type : target.value};
                                    const updatedFields = clone(fields);
                                    updatedFields[index] = updatedField;

                                    setInfo({...info, fields : updatedFields})
                                }}
                                variant="outlined"
                            >
                                <MenuItem value={'percentage'}>Percentage</MenuItem>
                                <MenuItem value={'text'}>Text</MenuItem>
                            </TextField>
                            : null
                        }

                        <IconButton onClick={() => {
                            const updatedFields = fields.filter((a, i) => i !== index);
                            setInfo({...info, fields : updatedFields})
                        }}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                })}
            </div>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={anonymous}
                        onChange={({target}) => setInfo({...info, [target.name] : target.checked})}
                        name="anonymous"
                        color="primary"
                    />
                }
                label="Leave answer anonymously"
            />

            <Button className={classes.submitBtn}
                color='primary'
                variant="contained"
                disabled={!isValid}
                type="submit"
            >
                Create
            </Button>
        </form>
    </Container>;
};

export default CreatePost;
