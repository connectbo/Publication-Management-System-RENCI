import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles({
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
  left: {
    width: '40%',
  }
});

function Add() {
  const classes = useStyles();
  const currentUrl = window.location.hostname;
  const [ref, setrefState] = useState('');
  const [textarea, setTextArea] = useState('');
  const [checkStatus, setcheckStatus] = useState({ 'Fetchable': [], 'Error': [], 'Existing': [] });
  const [insertStatus, setinsertStatus] = useState([]);
  const [result, setResultState] = useState('');
  const [file, setFile] = useState('');
  const [authorString, setAuthorStringState] = useState('');
  const [checked, setChecked] = useState([])

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleChange = event => {
    setrefState(event.target.value);
  }

  const handleTextAreaChange = event => {
    setTextArea(event.target.value);
  }

  const fileChangeHandler = event => {
    setFile(event.target.files[0]);
  }

  function submitFile() {
    let formData = new FormData();
    formData.append('dois', file);
    console.log(formData.get('dois'))
    fetch(`http://${currentUrl}:5000/insert`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }

  const textAreaCheck = event => {
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
        setcheckStatus(data);
        console.log(data);
      })
  }

  const textAreaSubmit = event => {
    event.preventDefault();
    fetch(`http://${currentUrl}:5000/insert`, {
      method: 'POST',
      body: JSON.stringify(checkStatus.Fetchable),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setinsertStatus(data);
      })
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetch(`http://${currentUrl}:5000/reference/${ref}/save=yes`)
      .then(res => res.json())
      .then(data => {
        setResultState(data);
        setAuthorStringState(data.Authors.join(', '));
      })
  }

  return (
    <div>
      {/* <Container className={classes.root}>
        <Typography><strong>PubFinder</strong></Typography>
        <Input className={classes.input} id="ref" type="text" placeholder="Enter DOI to add Publications.." value={ref} onChange={handleChange}></Input>
        <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}>
          ADD </Button>
      </Container>
      <Container>
        <input type='file' name='file' onChange={fileChangeHandler} />
        <Button className={classes.subButton} color="secondary" onClick={submitFile}>Upload File</Button>
      </Container> */}
      <Container className={classes.root}>
        <Container className={classes.left}>
          <Typography><b>Step 1: Copy and Paste your DOI(s)</b></Typography>
          <hr/>
          <textarea className={classes.inputtext} id="user_input" rows='25' cols='40' placeholder='10.1212/wnl.0b013e318221c187&#10;10.1111/j.1752-8062.2011.00324.x&#10;10.1145/2030718.2030727' onChange={handleTextAreaChange}>{textarea}
          </textarea>
        </Container>
        <Container>
          <Typography><b>Step 2: DOI Validation</b></Typography>
          <hr/>
          <Typography>In total, {checkStatus.Fetchable.length+checkStatus.Existing.length+checkStatus.Error.length} unique doi(s) are detected. </Typography>
          <br/>
          <Typography><b>{checkStatus.Fetchable.length} DOI(s) Fetchable via Crossref API: </b></Typography>
          {checkStatus.Fetchable.map(status => <Typography>{status}</Typography>)}
          <br />
          <Typography><b>{checkStatus.Error.length} DOI(s) Unfetchable via Crossref API: </b></Typography>
          {checkStatus.Error.map(status => <Typography>{status}</Typography>)}
          <br />
          <Typography><b>{checkStatus.Existing.length} Already Stored DOI(s):</b></Typography>
          {checkStatus.Existing.map(status => <Typography>{status}</Typography>)}
          <Button variant="contained" color="secondary" onClick={textAreaCheck}> Check </Button>
        </Container>
        <Container>
          <Typography><b>Step 3: Insert into RENCI Database</b></Typography>
          <hr/>
          <Typography><b>{insertStatus.length} Inserted DOI(s):</b></Typography>
          {insertStatus.map(pub => <Typography>{pub}</Typography>)}
          <Button variant="contained" color="secondary" onClick={textAreaSubmit}> Insert {checkStatus.Fetchable.length} Fetchable DOI(s) </Button>
        </Container>
      </Container>      {/* <Container>
        <Typography className={classes.body}><strong>   Result :  </strong>{result.status}</Typography>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.body}><strong>Title: </strong> {result.Title}</Typography>
            <Typography className={classes.body}><strong>DOI: </strong>{result.DOI}</Typography>
            <Typography className={classes.body}><strong>Author(s): </strong>{authorString}</Typography>
            <Typography className={classes.body}><strong>Type: </strong> {result.Type}</Typography>
          </CardContent>
        </Card>
      </Container> */}
    </div>
  );
}

export default Add;