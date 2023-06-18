import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import PlotlyPlots from '../components/PlotlyPlots'
import React, { useState, useCallback, useEffect } from "react";
import Papa from "papaparse";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { linReg } from '../components/utils';

const allowedExtensions = ["csv"];

export default function Home() {
  const [file, setFile] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  
  const [selected_plot_type, setSelectedPlotType] = useState('');
  const [col_names, setColNames] = useState([]);
  const [selectedXvar, setSelectedXvar] = useState([]);
	const [selectedYvar, setSelectedYvar] = useState();
  
  const [open, setOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [plotSchema, setPlotSchema] = useState({})
  const [state, setState] = useState({});

	const handleChange = (event) => {
		setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
	};

	const handleClose = () => {
    handlePLOT();
		setOpen(false);

	};

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

	};

  // console.log(parsedData)

  useEffect(() =>{
    // setState({})
    if(selected_plot_type == 'boxplot' || selected_plot_type == 'violin' || selected_plot_type == "raincloud"){
      setOpen(true)
    }
    // selected_plot_type == 'boxplot' ? setOpen(true) : console.log('if you select boxplot you will get a menu to select variable');
    handlePLOT();
  },[selected_plot_type, selectedXvar, selectedYvar])

  //use My wraper
  var handlePLOT = () =>{
    var  plotSchema = {
      inputData : data,
      ploty_type : '',
      variablesToPlot : []
    } 
    if(selected_plot_type === 'boxplot'){
      plotSchema.ploty_type = 'boxplot'
      plotSchema.variablesToPlot = Object.keys(state);
    }else if(selected_plot_type === 'violin' ){
      plotSchema.ploty_type = 'violin'
      plotSchema.variablesToPlot = Object.keys(state);
    }else if(selected_plot_type === 'raincloud'){
      plotSchema.ploty_type = 'raincloud'
      plotSchema.variablesToPlot = Object.keys(state);
    }else{
      plotSchema.ploty_type = selected_plot_type      
      plotSchema.variablesToPlot = [selectedXvar, selectedYvar]
    }
    setPlotSchema(plotSchema)
    var newState = {}
    setState(newState)

  }
  return (
    <div className={styles.container}>
      <Head className="header">
        <title>dataVis</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Header/>

      <Grid className="top-grid" container spacing={1} columns={3} columnGap = {2}>
        <Button variant="outlined" >
          <input type="File" onChange={handleFileChange} id="csvInput" name="file" />
        </Button>
        <Button variant="outlined" onClick={handleParse}>
            Parse
        </Button>

        <Autocomplete
          options={['bar','line', 'histogram', 'boxplot', 'scatter', 'linReg', 'violin', 'raincloud']}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="choose plot type" />}
          onInputChange = {(e) => setSelectedPlotType(e.target.innerHTML)}
        />

        {open || <Autocomplete
          options={col_names}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="choose x-variable" />}
          onInputChange = {(e) => setSelectedXvar(e.target.innerHTML)}
        />
        }
      { selected_plot_type === 'histogram' | selected_plot_type === 'line' || 
        <Autocomplete
          options={col_names}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="choose y-variable" />}
          onInputChange = {(e) => setSelectedYvar(e.target.innerHTML)}
        />
      }
        <Button variant="outlined" onClick={() => {setIsToggled(true)}}>Plot</Button>
		</Grid>





    {!isToggled || 

      <PlotlyPlots plotSchema = {plotSchema} />

    }

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Select Box Plots</DialogTitle>
				<DialogContent >
				<FormGroup variant="standard" sx={{ width: 1000 , m: 1}}>
						{col_names.map((item) => <FormControlLabel 
													control={<Checkbox onChange={handleChange} name={item} />}
													label={item}
												/>)}
    			</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						OK
					</Button>
				</DialogActions>
			</Dialog>
				
    </div>
  )
}


