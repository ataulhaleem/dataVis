import React, { useEffect, useState} from "react";
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })
import { ManhattanHeatMap, linReg } from "./utils";



const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0
  }

var primaryLaout = {
    showlegend: true,
    width :800,
    height : 800,
    // autosize: true,
    hovermode: "closest",
    editable: true,
    // xaxis: {
    //     title: {text: 'x Axis'},
    //     zeroline : false
    // },
    // yaxis: {
    //     title: {text: 'x Axis'},
    //     showgrid: true,
    // },
}

const PlotlyPlots = (props) => {
    var plotyType = props.plotSchema.ploty_type;
    var inputData = props.plotSchema.inputData;
    var selectedVars = props.plotSchema.variablesToPlot;

    const [plotData, setPlotData] = useState([]);
    const [plotLayout, setPlotLayout] = useState({});

    useEffect(()=>{
        handlePlotData(selectedVars,plotyType,inputData)
    }, [plotyType,selectedVars ])

    var handlePlotData = (selectedVars,plotyType,inputData ) => {
        var xdata = [];
        var ydata = [];
    
        var x = selectedVars[0]; 
        var y = selectedVars[1];   
        if(!isObjectEmpty(inputData)){
            for(let i=0;i < inputData.length;i++){
                var obj = inputData[i]
                xdata.push(obj[x])
                ydata.push(obj[y])
            }
        }
    
        // console.log(x, xdata)
        // console.log(y, ydata)
    
        //////////////////////////// Now for plot types
    
        if(plotyType == 'bar'){
            var plotData=[{type : 'bar', x:xdata, y:ydata} ];
            var plotLayout = primaryLaout;
            plotLayout['xaxis'] = {}
            plotLayout['yaxis'] = {}
            plotLayout.xaxis['title'] = x
            plotLayout.yaxis['title'] = y
            plotLayout['boxmode'] = 'group'

    
        }else if(plotyType == 'line' ){
            var plotData=[{type : 'line', y:xdata} ];
            var plotLayout = primaryLaout;
            plotLayout['xaxis'] = {}
            plotLayout['yaxis'] = {}
            plotLayout.xaxis['title'] = x
            plotLayout.yaxis['title'] = y
            // console.log('modify it for many variables')
    
        }else if(plotyType == 'histogram' ){
            var plotData=[{type : 'histogram', x:xdata} ];
            var plotLayout = primaryLaout;
            plotLayout['xaxis'] = {}
            plotLayout.xaxis['title'] = x
            plotLayout['yaxis'] = {}
            plotLayout.yaxis['title'] = ''

        }else if(plotyType == 'scatter' ){
                var plotData=[{type : 'scattergl', mode: 'markers',x:xdata, y:ydata} ];
                var plotLayout = primaryLaout;
                plotLayout['xaxis'] = {}
                plotLayout['yaxis'] = {}
                plotLayout.xaxis['title'] = x
                plotLayout.yaxis['title'] = y
    
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
    
            }else if(plotyType == 'violin' ){
                var input_Obj = {};
                selectedVars.map(key =>{
                    var Y =[];	
                    input_Obj[key] = {
                        y:Y, 
                        type :'violin', 
                        name:key, 
                        points: 'none',
                        box: { visible: true },
                        boxpoints: false,
                        line: { color: 'black' },
                        fillcolor: '#8dd3c7',
                        opacity: 0.6,
                        meanline: { visible: true }}
                    })
                for(let i=0;i < inputData.length;i++){
                    var obj = inputData[i]
                    selectedVars.map(key =>{
                        input_Obj[key].y.push(obj[key]) 
    
                    })
                }
                var plotData = Object.values(input_Obj)   
    
            } else if(plotyType == 'raincloud' ){
                var plotLayout = primaryLaout;
                var input_Obj = {};
                var cnt = 0;
                var N = selectedVars.length;
                var chunk = 1/N
                var a = 0;
                var b = chunk;
                selectedVars.map(key =>{
                    var Y =[];	
                    var y_axis;
                    if(cnt == 0){
                        y_axis = "yaxis"
                        a = b;
                        b = b + chunk;        
                    }else if(cnt==1){
                        y_axis = 'yaxis2'
                        plotLayout[y_axis] = []
                        plotLayout[y_axis]["domain"] = [a,b]
                        a = b;
                        b = b + chunk;        
                    }else{
                        y_axis = `yaxis${cnt+1}`
                        plotLayout[y_axis] = []
                        plotLayout[y_axis]["domain"] = [a,b]
                        a = b;
                        b = b + chunk;        
                    }
                    input_Obj[key] = [
                        {
                            x: Y, 
                            name: key, 
                            yaxis: y_axis, 
                            type: 'violin', 
                            side : "positive",  
                            line: { width: 0.75}, //color : 'green',
                        },
                        { 
                            x: Y, 
                            name: key,
                            showlegend :false,
                            type: 'box',
                            opacity: 0.4,
                            boxpoints : 'all',
                            jitter : 1,
                            whiskerwidth : 0.3, 
                            width : 0.15, 
                            fillcolor : 'orange', 
                            yaxis: y_axis, 
                            // boxmean : 'sd',
                            marker : { color: 'green',opacity : 1,size : 3,outliercolor : 'red',Symbol: "diamond"},
                            line: {color : 'red',width:2},
                        },
                           
                    ]
                    cnt = cnt +1               
                })
                for(let i=0;i < inputData.length;i++){
                    var obj = inputData[i]
                    selectedVars.map(key =>{
                        input_Obj[key][0].x.push(obj[key]) 
                        input_Obj[key][1].x.push(obj[key]) 
                    })
                }
            var plotData = []
            Object.values(input_Obj).map(item=>{
                item.map(trace =>{
                    plotData.push(trace)
                })
            })
            }else if(plotyType == 'linReg' ){
            var regLineData = linReg(xdata,ydata);
            var plotData=[{type : 'scattergl', mode: 'markers',x:xdata, y:ydata},regLineData ];
            var plotLayout = primaryLaout;
            plotLayout['xaxis'] = {}
            plotLayout['yaxis'] = {}
            plotLayout.xaxis['title'] = x
            plotLayout.yaxis['title'] = y
            plotLayout.showlegend = false
    
        } else if(plotyType == 'heatMap'){
    
            var x = selectedVars;
            var y = selectedVars;
            var z = ManhattanHeatMap(x,y, inputData)
            var plotData = [
                {x: x,
                    y: y,
                    z: z,
                    type: 'heatmap',
                    // colorscale: colorscaleValue,
                    showscale: false}
            ]
        }else{
            console.log('Please choose a plot type')
        }
        setPlotData(plotData)
        setPlotLayout(plotLayout)
    

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
