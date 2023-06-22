import React from 'react'
import { Typography } from '@mui/material'

export default function Header() {
  return (
    <>  

    <Typography variant='h4'>
        Browser based data visualization 
    </Typography>
    
    <Typography variant='h6'>
    Single Page Application for data visualization (dataVis)
    </Typography>

    <Typography  variant='p'>
    ataulhaleem@gmail.com

    </Typography>

    <Typography  variant='h6'>
    Usage:
      <ol>
      <li>Choose project data OR select your own data </li>
      <li>Press PARSE</li>
      <li>Choose plotting options</li>
      <li> Press PLOT</li>
    </ol> 
    </Typography>



    {/* <Typography variant='h6'>
    Description
    </Typography>

    <Typography variant='p'>
       dataVis provides webbased interactive plots for your data. It is meant to abstract away any command line expertise required to process large files as well as plotting options.
      This app can be downloaded and run on you machine as well as used here. The application  provides basic plot types at the moment but is under active development. 
      The aim is to re-use the component in a bigger application.
    </Typography> */}
    </>
    
  )
}
