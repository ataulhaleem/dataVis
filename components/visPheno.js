import React, { useState} from "react";
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })



const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0
  }

var primaryLaout = {
    width :800,
    height : 800,
    // autosize: true,
    hovermode: "closest",
    editable: true,
    xaxis: {
        title: {text: 'x Axis'}
    },
    yaxis: {
        title: {text: 'x Axis'}
    }
}

const PlotlyPlots = (props) => {

    var plotyType = props.plotSchema.ploty_type;
    var inputData = props.plotSchema.inputData;
    var selectedVars = props.plotSchema.variablesToPlot;

    const [Xdata,setXdata] = useState([]);
    const [Ydata,setYdata] = useState([]);
    const [tracesData,setTracesData] = useState([]);

    var x = selectedVars[0]; 
    var y = selectedVars[1];
    
    var xdata = [];
    var ydata = [];

    if(!isObjectEmpty(inputData)){
        for(let i=0;i < inputData.length;i++){
            var obj = inputData[i]
            xdata.push(obj[x])
            ydata.push(obj[y])
        }
    }

    //////////////////////////// Now for plot types

    if(plotyType == 'bar'){
        var plotData=[{type : 'bar', x:xdata, y:ydata} ];
        var plotLayout = primaryLaout;
        plotLayout['boxmode'] = 'group'
        plotLayout.xaxis.title = x
        plotLayout.yaxis.title = y

    }else if(plotyType == 'line' ){
        var plotData=[{type : 'line', x:xdata, y:ydata} ];
        var plotLayout = primaryLaout;
        plotLayout.xaxis.title = x
        plotLayout.yaxis.title = y
    }else if(plotyType == 'histogram' ){
			var plotData=[{type : 'histogram', x:xdata} ];
            var plotLayout = primaryLaout;
            plotLayout.xaxis.title = x
            plotLayout.yaxis.title = y
    }else if(plotyType == 'scatter' ){
			var plotData=[{type : 'scattergl', mode: 'markers',x:xdata, y:ydata} ];
            var plotLayout = primaryLaout;
            plotLayout.xaxis.title = x
            plotLayout.yaxis.title = y
    }else if(plotyType == 'boxplot' ){
        var input_Obj = {};
        selectedVars.map(key =>{
            var Y =[];	
            input_Obj[key] = {y:Y, type :'box', name:key}  
            }
        )
        for(let i=0;i < inputData.length;i++){
            var obj = inputData[i]
            selectedVars.map(key =>{
                input_Obj[key].y.push(obj[key]) 

            })
        }
		var plotData = Object.values(input_Obj)   
    }

	return (
        // plotNow || 
            <Plot 
                sx = {{p:4,m:1}}
                data={plotData}
                layout={ plotLayout }
            />
	);
};

export default PlotlyPlots;
