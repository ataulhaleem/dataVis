import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })
import Button from '@mui/material/Button';
import { padding } from "@mui/system";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const VisPheno = () => {
	
	// This state will store the parsed data
	const [col_names, setColNames] = useState([]);
	const [data, setData] = useState([]);

	// It state will contain the error when
	// correct file extension is not used
	const [error, setError] = useState("");
	
	// It will store the file uploaded by the user
	const [file, setFile] = useState("");
	const [selectedXvar, setSelectedXvar] = useState([]);
	const [selectedYvar, setSelectedYvar] = useState();
	const [selected_plot_type, setSelectedPlotType] = useState('');
	const [plot_input_data, setPlotIinputData] = useState([]);
	const [plot_layout, setPlotLayout] = useState({});
	
	const handleX = (val) => {
		setSelectedXvar(val);
		console.log(selectedXvar);
	}
	// const handleY = (e) => {
	// 	// setSelectedYvar(e.target.innerHTML);
	// 	console.log(selectedYvar);
	// }

	const [x, setX] = useState([]);
	const [y, setY] = useState([]);

	// This function will be called when
	// the file input changes
	const handleFileChange = (e) => {
		setError("");
		
		// Check if user has entered the file
		if (e.target.files.length) {
			const inputFile = e.target.files[0];
			
			// Check the file extensions, if it not
			// included in the allowed extensions
			// we show the error
			const fileExtension = inputFile?.type.split("/")[1];
			if (!allowedExtensions.includes(fileExtension)) {
				setError("Please input a csv file");
				return;
			}

			// If input type is correct set the state
			setFile(inputFile);
		}
	};
	const handleParse = () => {
		
		// If user clicks the parse button without
		// a file we show a error
		if (!file) return setError("Enter a valid file");

		// Initialize a reader which allows user
		// to read any file or blob.
		const reader = new FileReader();
		
		// Event listener on reader when the file
		// loads, we parse it and set the data.
		reader.onload = async ({ target }) => {
			const csv = Papa.parse(target.result, { header: true });
			const parsedData = csv?.data;
			// console.log(parsedData);
			setData(parsedData);

      	const columns = Object.keys(parsedData[0]);
				setColNames(columns);
			};
		reader.readAsText(file);

		// console.log(selectedXvar);
		// console.log(selectedYvar);
		// console.log(selected_plot_type);
		// console.log(x);
		// console.log(y);
   
	};
	
	useEffect(() => {
		var x_data = [];
		for(let i=0;i < data.length;i++){
        	x_data.push(data[i][selectedXvar]);
			};
	    setX(x_data);

		var y_data = [];
		for(let i=0;i < data.length;i++){
        	y_data.push(data[i][selectedYvar]);
			};
	    setY(y_data);
	})

	const handlePLOT = () => {
		

		if(selected_plot_type == 'Bar'){
			var input_data=[{type : 'bar', x:x, y:y} ];
			setPlotIinputData(input_data);
			var new_layout = {
				width: 800, 
				height: 600,
				yaxis: {
					title: selectedYvar,
					zeroline: false},
				boxmode: 'group',
				xaxis: {
					title: selectedXvar},
				title: 'Bar plot'}
			setPlotLayout(new_layout); 

		}else if(selected_plot_type == 'Line' ){
			var input_data=[{type : 'line', x:x, y:y} ];
			setPlotIinputData(input_data);
			var new_layout = {
				width: 800, 
				height: 600,
				yaxis: {
					title: selectedYvar,
					zeroline: false},
				boxmode: 'group',
				xaxis: {
					title: selectedXvar},
				title: 'Line plot'}
			setPlotLayout(new_layout); 

		}else if(selected_plot_type == 'Histogram' ){
			var input_data=[{type : 'histogram', x:x, y:y} ];
			setPlotIinputData(input_data);
			var new_layout = {
				width: 800, 
				height: 600,
				yaxis: {
					title: selectedYvar,
					zeroline: false},
				boxmode: 'group',
				xaxis: {
					title: selectedXvar},
				title: 'Histogram'}
			setPlotLayout(new_layout); 


		}else if(selected_plot_type == 'Box plot' ){
			var input_data=[{type : 'box', x:x, name : selectedXvar},{type : 'box', x:y, name: selectedYvar} ];
			setPlotIinputData(input_data);
			var new_layout = {
				width: 800, 
				height: 600,
				title: 'Box plot'}
			setPlotLayout(new_layout); 


		}else if(selected_plot_type == 'Scatter' ){
			var input_data=[{type : 'scatter', mode: 'markers',x:x, y:y} ];
			setPlotIinputData(input_data);
			var new_layout = {
				width: 800, 
				height: 600,
				yaxis: {
					title: selectedYvar,
					zeroline: false},
				boxmode: 'group',
				xaxis: {
					title: selectedXvar},
				title: 'Scatter plot'}
			setPlotLayout(new_layout); 


		};
		
	};


	return (

		<div>
		<h1></h1>
    	<Grid2  container spacing={1} columns={16} columnGap = {2}>
			<label htmlFor="csvInput" style={{ display: "block" }}>
				Enter CSV File
			</label>
			<input
				onChange={handleFileChange}
				id="csvInput"
				name="file"
				type="File"
			/>
			<div>
				<button onClick={handleParse}>Parse</button>
			</div>

			<Autocomplete
				options={['Bar','Line', 'Histogram', 'Box plot', 'Scatter']}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label="choose plot type" />}
				onInputChange = {(e) => setSelectedPlotType(e.target.innerHTML)}
			/>
			<Autocomplete
				options={col_names}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label="choose x-variable" />}
				onInputChange = {(e) => setSelectedXvar(e.target.innerHTML)}
			/>

			<Autocomplete
				options={col_names}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label="choose y-variable" />}
				onInputChange = {(e) => setSelectedYvar(e.target.innerHTML)}
			/>

			<Button variant="outlined" onClick={handlePLOT}>Plot</Button>

		</Grid2>
		<h1></h1>

		<Plot 
			sx = {{p:4}}
			data={plot_input_data}
			layout={ plot_layout }
		></Plot>
    
  </div>
	);
};

export default VisPheno;
