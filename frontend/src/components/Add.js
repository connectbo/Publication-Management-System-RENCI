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

import Alert from '@material-ui/lab/Alert';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

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
  },
  button: {
    backgroundColor: '#078AC1'
  },
  dropzone: {
    backgroundColor: '#078AC1'
  },
  instruction: {
    paddingLeft: 20,
    paddingTop: 20
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
  const [file, setFile] = useState([]);
  const [result, setResultState] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [fetchableNum, setFetchable] = useState('');
  const [checked, setChecked] = useState([])
  const [isLoading, setLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0].type == "text/plain") {
      setFile(acceptedFiles);
    }
    else {
      alert("Please select a text file(.txt).")
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTabChange = event => {
    setTabValue(event.value);
  }

  const handleTextAreaChange = event => {
    setTextArea(event.target.value);
  }

  const check = event => {
    event.preventDefault();
    if (file.length == 0) {
      textAreaCheck();
    }
    else {
      uploadFileCheck();
    }
  }

  function textAreaCheck() {
    setLoading(true);
    const lines = textarea.split('\n');
    fetch(`http://${currentUrl}:5000/check`, {
      method: 'POST',
      body: lines,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => res.json())
      .then(data => {
        setcheckStatus(data);
        setFetchable(data.Fetchable.length);
        setinsertStatus({
          'Inserted': [],
          'Inserted with missing value': []
        });
        setLoading(false);
      })
  }

  function uploadFileCheck() {
    setLoading(true);
    const formData = new FormData()
    formData.append('myDOI', file[0]);
    fetch(`http://${currentUrl}:5000/fileCheck`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setcheckStatus(data);
        setFetchable(data.Fetchable.length);
        setinsertStatus({
          'Inserted': [],
          'Inserted with missing value': []
        });
        setLoading(false);
      });
  }

  const textAreaSubmit = event => {
    let toSend = [];
    checkStatus.Fetchable.forEach(pub => {
      if (pub.Checked) {
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
        alert(`${data.Inserted.length} publication added successfully.`)
      })
  }

  const handleExpandChange = curr_doi => (event, isExpanded) => {
    setExpanded(isExpanded ? curr_doi : false);
  };

  const handleCheckboxChange = event => {
    checkStatus.Fetchable.forEach(pub => {
      if (pub.DOI == event.target.value) {
        pub.Checked = event.target.checked;
      }
    })
    setcheckStatus(checkStatus);
    let curr_fetchable_num = 0;
    checkStatus.Fetchable.forEach(pub => {
      if (pub.Checked == true) {
        curr_fetchable_num += 1;
      }
    })
    setFetchable(curr_fetchable_num);
  }



  return (
    <div>
      <Alert severity="info"><b>Instructions: </b> You can add a publication by providing its DOI. If you do not have an DOI, please visit this <a href="https://docs.google.com/forms/d/e/1FAIpQLSdtJQ2h8qalkr6r1jIBhmJs88M_t_GVqOekdcX6zGVtgcBZAQ/viewform?usp=sf_link" target="_blank">link</a> to request one.</Alert>
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
              <textarea className={classes.inputtext} id="user_input" rows='25' cols='30' placeholder='10.1212/wnl.0b013e318221c187&#10;10.1111/j.1752.00324.x&#10;10.1145/2030718.2030727' onChange={handleTextAreaChange}>{textarea}
              </textarea>
            </TabPanel>
            <TabPanel>
              <Alert severity="info">Note: Please put a list of DOIs in a text file(.txt), and make sure each line begins with a DOI.</Alert>
              <br />
              <div {...getRootProps()}>
                <input className="dropzone" {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Drop the files here ...</p> :
                    <Button>Upload File</Button>
                }
                <Typography>{(file.length > 0) ? "File Name: " + file[0].name : ""}</Typography>
                <Typography>{(file.length > 0) ? "File Type: " + file[0].type : ""}</Typography>
              </div>
            </TabPanel>
          </Tabs>
        </Container>
        <Container>
          <Typography><b>Step 2: DOI Validation</b></Typography>
          <hr />
          <Typography>In total, {checkStatus.Fetchable.length + checkStatus.Existing.length + checkStatus.Error.length} unique doi(s) are detected. </Typography>
          <br />
          {(isLoading) ? <CircularProgress /> : <Button variant="contained" className={classes.button} color="primary" onClick={check}> Check </Button>}
          <br />
          {(checkStatus.Fetchable.length + checkStatus.Existing.length + checkStatus.Error.length > 0) ? <div>
            <br />
            <Typography><b>{checkStatus.Fetchable.length} DOI(s) Fetchable using RESTful API: </b></Typography>
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
            <Typography><b>{checkStatus.Error.length} DOI(s) Unfetchable using RESTful API: </b></Typography>
            {checkStatus.Error.map(pub => <div><Typography>{pub['DOI']}</Typography><Typography>Please contact <u>comms@renci.org</u> to add this publication.</Typography></div>)}
            <br />
            <Typography><b>{checkStatus.Existing.length} Already Stored DOI(s):</b></Typography>
            {checkStatus.Existing.map(status => <Typography>{status}</Typography>)}
          </div> : <br />}
        </Container>
        <Container>
          <Typography><b>Step 3: Insert into RENCI Database</b></Typography>
          <hr />
          <Typography><b>{insertStatus.Inserted.length} Inserted DOI(s):</b></Typography>
          <br />
          {insertStatus.Inserted.length > 0 ? insertStatus.Inserted.map(pub => <Typography>{pub} - Success</Typography>) : <Button variant="contained" className={classes.button} color="primary" onClick={textAreaSubmit}> Insert {fetchableNum} Fetchable DOI(s) </Button>}
        </Container>
      </Container>
    </div>
  );
}

export default Add;