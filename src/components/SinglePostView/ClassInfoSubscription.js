import {gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";
import React, {Component} from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import ChartsComponent from "./ChartsComponent";

const CLASS_INFO_QUERY = gql`
    query ClassInfoQUery($id: ID!) {
        class(id: $id) {
            id
            name
            attendees{
                id
                name
                createdAt
            }
            post {
                anonymous
                answerType
                fields{
                    id
                    label
                    type
                    relativeClassAnswers(classId:$id){
                        id
                        value
                        author{
                            name
                        }
                    }
                }
            }
        }
    }
`;

const ATTENDEES_SUBSCRIPTION = gql`
    subscription attendeeSubscription($classId: ID!) {
        attendeeSubscription(classId: $classId) {
            id
            name
            attendees{
                id
                name
                createdAt
            }
            post {
                anonymous
                answerType
                fields{
                    id
                    label
                    type
                    relativeClassAnswers(classId:$classId){
                        id
                        value
                        author{
                            name
                        }
                    }
                }
            }
        }
    }
`;


export default function CommentsPageWithData({selectedClassId}) {
    const {subscribeToMore, ...result} = useQuery(CLASS_INFO_QUERY, {variables : {id : selectedClassId}});

    return (
        <ClassInfoSection
            {...result}
            subscribeToMoreAttendees={() =>
                subscribeToMore({
                    document    : ATTENDEES_SUBSCRIPTION,
                    variables   : {classId : selectedClassId},
                    updateQuery : (prev, {subscriptionData}) => {
                        if(!subscriptionData.data) return prev;
                        const newFeedItem = subscriptionData.data.attendeeSubscription;

                        return Object.assign({}, prev, {
                            class : {
                                ...prev.class,
                                ...newFeedItem
                            }
                        });
                    }
                })
            }
        />
    );
}


export class ClassInfoSection extends Component {
    componentDidMount() {
        this.props.subscribeToMoreAttendees();
    }

    render() {
        const {data, loading} = this.props;

        if(loading)
            return <div style={{display : "grid", height : "100%", alignItems : "center", justifyItems : "center"}}>
                <CircularProgress/>
            </div>;

        return <ChartsComponent data={data}/>
    }
}
