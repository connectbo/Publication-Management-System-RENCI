import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';


const useStyles = makeStyles({
  body: {
    fontSize: 18,
    padding: '8px 8px',
  },
  subButton: {
    marginLeft: 10,
  },
  root: {
    padding: '12px 12px',
    display: 'flex',
    alignItems: 'center',
    width: 700,
  },
  input: {
    marginLeft: 8,
    flex: 1
  }
});

function Add() {
  const classes = useStyles();
  const currentUrl = window.location.hostname;
  const [ref, setrefState] = useState('');
  const [textarea, setTextArea] = useState('');
  const [insertStatus, setinsertStatus] = useState('');
  const [result, setResultState] = useState('');
  const [file, setFile] = useState('');
  const [authorString, setAuthorStringState] = useState('');

  const handleChange = event => {
    setrefState(event.target.value);
  }

  const handleTextAreaChange = event => {
    setTextArea(event.target.value);
  }

  const fileChangeHandler = event => {
    console.log(event.target.files[0]);
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

  const textAreaSubmit = event => {
    event.preventDefault();
    fetch(`http://${currentUrl}:5000/insert`, {
      method: 'POST',
      body: textarea,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setinsertStatus(data))
      console.log(insertStatus);
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
      <Container className={classes.root}>
        <Typography><strong>PubFinder</strong></Typography>
        <Input className={classes.input} id="ref" type="text" placeholder="Enter DOI to add Publications.." value={ref} onChange={handleChange}></Input>
        <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}>
          ADD </Button>
      </Container>
      <Container>
        <input type='file' name='file' onChange={fileChangeHandler} />
        <Button className={classes.subButton} color="secondary" onClick={submitFile}>Upload File</Button>
      </Container>
      <Container>
        <textarea rows="30" cols="100" onChange={handleTextAreaChange}>
        </textarea>
        <Typography className={classes.body}></Typography>
        <Button className={classes.subButton} variant="contained" color="secondary" onClick={textAreaSubmit}>
          Submit </Button>
      </Container>
      <Container>
        <Typography className={classes.body}><strong>   Result :  </strong>{result.status}</Typography>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.body}><strong>Title: </strong> {result.Title}</Typography>
            <Typography className={classes.body}><strong>DOI: </strong>{result.DOI}</Typography>
            <Typography className={classes.body}><strong>Author(s): </strong>{authorString}</Typography>
            <Typography className={classes.body}><strong>Type: </strong> {result.Type}</Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Add;