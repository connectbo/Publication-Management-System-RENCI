import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import {useDropzone} from 'react-dropzone';

const useStyles = makeStyles({
  card: {
    marginTop: 10
  },
  body: {
    fontSize: 18,
    padding: '8px 8px',
  },
  subButton: {
    marginLeft: 600,
  },
  subButton2: {
    marginLeft: 100,
  },
  root: {
    margin: '12px 12px',
    padding: '12px 12px',
    display: 'flex',
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  inputtext: {
    fontSize: 18,
    padding: '8px 8px',
    display: 'inline'
  }
});

function Add() {
  const classes = useStyles();
  const currentUrl = window.location.hostname;
  const [ref, setrefState] = useState('');
  const [textarea, setTextArea] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [checkStatus, setcheckStatus] = useState({ 'Fetchable': [], 'Error': [], 'Existing': [] });
  const [insertStatus, setinsertStatus] = useState({
    'Inserted': [],
    'Inserted with missing value': []
  });
  const [result, setResultState] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [fetchableNum, setFetchable] = useState('');
  const [checked, setChecked] = useState([])
  const [isLoading, setLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {}, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  const handleTabChange = event => {
    setTabValue(event.value);
  }

  const handleTextAreaChange = event => {
    setTextArea(event.target.value);
  }

  const textAreaCheck = event => {
    setLoading(true);
    const lines = textarea.split('\n');
    event.preventDefault();
    fetch(`http://${currentUrl}:5000/check`, {
      method: 'POST',
      body: lines,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setcheckStatus(data);
        setFetchable(data.Fetchable.length);
        setinsertStatus({
          'Inserted': [],
          'Inserted with missing value': []
        });
        setLoading(false);
      })
  }

  const textAreaSubmit = event => {
    let toSend = [];
    checkStatus.Fetchable.forEach(pub => {
      if(pub.Checked){
        toSend.push(pub);
      }
    })
    event.preventDefault();
    fetch(`http://${currentUrl}:5000/insert`, {
      method: 'POST',
      body: JSON.stringify(toSend),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setinsertStatus(data);
      })
  }

  const handleExpandChange = curr_doi => (event, isExpanded) => {
    setExpanded(isExpanded ? curr_doi : false);
  };

  const handleCheckboxChange = event => {
    checkStatus.Fetchable.forEach(pub => {
      if(pub.DOI == event.target.value){
        pub.Checked = event.target.checked;
      }
    })
    setcheckStatus(checkStatus);
    let curr_fetchable_num = 0;
    checkStatus.Fetchable.forEach(pub => {
      if(pub.Checked == true){
        curr_fetchable_num+=1;
      }
    })
    setFetchable(curr_fetchable_num);
  }



  return (
    <div>
      <Container className={classes.root}>
        <Container>
          <Typography><b>Step 1: Import your DOI(s)</b></Typography>
          <hr />
          <Tabs value={tabValue} onChange={handleTabChange}>
            <TabList>
              <Tab>via Textarea</Tab>
              <Tab>via File Upload</Tab>
            </TabList>
          <TabPanel>
            <textarea className={classes.inputtext} id="user_input" rows='25' cols='30' placeholder='10.1212/wnl.0b013e318221c187&#10;10.1111/j.1752-8062.2011.00324.x&#10;10.1145/2030718.2030727' onChange={handleTextAreaChange}>{textarea}
            </textarea>
          </TabPanel>
          <TabPanel>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
              }
            </div>
          </TabPanel>
          </Tabs>
        </Container>
        <Container>
          <Typography><b>Step 2: DOI Validation</b></Typography>
          <hr />
          <Typography>In total, {checkStatus.Fetchable.length + checkStatus.Existing.length + checkStatus.Error.length} unique doi(s) are detected. </Typography>
          <br />
          {(isLoading) ? <CircularProgress /> : <Button variant="contained" color="secondary" onClick={textAreaCheck}> Check </Button>}
          <br/>
          {(checkStatus.Fetchable.length + checkStatus.Existing.length + checkStatus.Error.length > 0) ? <div>
            <Typography><b>{checkStatus.Fetchable.length} DOI(s) Fetchable via Crossref API: </b></Typography>
            {checkStatus.Fetchable.map(pub =>
              <ExpansionPanel className={classes.card} expanded={expanded === pub.DOI} onChange={handleExpandChange(pub.DOI)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Checkbox checked={pub.Checked} onChange={handleCheckboxChange} value={pub.DOI}></Checkbox>
                  <Container>
                    <Typography className={classes.heading}><strong>{pub.Title}</strong></Typography>
                    <Typography block><a href={"https://dx.doi.org/" + pub.DOI}>{pub.DOI}</a></Typography>
                  </Container>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Container>
                    {/* <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography> */}
                    <Typography className={classes.body}>Published on <strong>{pub.Created}</strong>, Category: <strong>{pub.Type}</strong></Typography><hr />
                    <Typography className={classes.body}><strong>Citation: </strong> {pub.Citation}</Typography>
                  </Container>
                </ExpansionPanelDetails>
              </ExpansionPanel>)}
            <br />
            <Typography><b>{checkStatus.Error.length} DOI(s) Unfetchable via Crossref API: </b></Typography>
            {checkStatus.Error.map(pub => <div><Typography>{pub['DOI']}</Typography><Typography>Error: {pub['Error']}</Typography></div>)}
            <br />
            <Typography><b>{checkStatus.Existing.length} Already Stored DOI(s):</b></Typography>
            {checkStatus.Existing.map(status => <Typography>{status}</Typography>)}
          </div> : <br />}
        </Container>
        <Container>
          <Typography><b>Step 3: Insert into RENCI Database</b></Typography>
          <hr />
          <Typography><b>{insertStatus.Inserted.length} Inserted DOI(s):</b></Typography>
          {insertStatus.Inserted.length>0 ? insertStatus.Inserted.map(pub => <Typography>{pub}</Typography>) :           <Button variant="contained" color="secondary" onClick={textAreaSubmit}> Insert {fetchableNum} Fetchable DOI(s) </Button>}
        </Container>
      </Container>
    </div>
  );
}

export default Add;