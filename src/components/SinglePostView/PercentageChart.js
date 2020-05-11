import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import Typography from "@material-ui/core/Typography";


const templateData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const valuesReg = {
    '0'   : 0,
    '10'  : 0,
    '20'  : 0,
    '30'  : 0,
    '40'  : 0,
    '50'  : 0,
    '60'  : 0,
    '70'  : 0,
    '80'  : 0,
    '90'  : 0,
    '100' : 0
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for(var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const processData = (answers, submittedFormsCount) => {

    const localValuesReg = {...valuesReg};
    answers.forEach(answer => {
        const value = answer.value;

        if(localValuesReg[value] !== undefined) {
            localValuesReg[value] = localValuesReg[value] + 1
        }
    });

    return templateData.map((val) => {
        return {
            subject  : val + "%",
            A        : localValuesReg[val],
            fullMark : submittedFormsCount,
        }
    })
};

const computeAvg = (data) => {
    const answersArr = data.map(item => Number(item.value));


    const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    return arrAvg(answersArr)

};

const getChartsData = (fields, submittedFormsCount) => {
    return fields.map((field) => {

        return {
            key   : field.id,
            title : field.label.length > 10 ? field.label.slice(0, 10) + '...' : field.label,
            data  : processData(field.relativeClassAnswers, submittedFormsCount),
            avg   : computeAvg(field.relativeClassAnswers),
            color : getRandomColor()
        }
    })
};

const PercentageChart = ({fields, submittedFormsCount}) => {
    const chartsInfo = getChartsData(fields, submittedFormsCount);

    const data = chartsInfo.map(({title, avg}) => ({avg, title}));


    return <div style={{display : "grid", gridTemplateColumns : "1fr 1fr", gridGap : "1em"}}>
        {chartsInfo.map(({data, title, key, color}) => {
            return <div key={key}>
                <Typography align='center'>{title}</Typography>
                <RadarChart cx={200} cy={115} width={350} height={250} data={data} key={key}>
                    <Label value="Pages of my website" offset={0} position="insideBottom"/>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="subject"/>
                    <PolarRadiusAxis/>
                    <Radar name="Percentage Result" dataKey="A" stroke={color} fill={color} fillOpacity={0.6}/>
                </RadarChart>
            </div>
        })}

        <BarChart width={data.length * 200} barSize={100} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="title"/>
            <YAxis domain={[0, 100]}/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="avg" fill={getRandomColor()}/>
        </BarChart>
    </div>
};

export default PercentageChart

