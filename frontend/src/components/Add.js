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
  const [textarea, setTextArea] = useState(`10.1111/risa.13004\n10.1111/risa.12990\n10.1109/noms.2018.8406240\n10.1109/noms.2018.8406273\n10.1093/sysbio/syx098\n10.1111/adb.12489\n10.1111/eip.12751\n10.1109/infcomw.2018.8407026\n10.1145/3213232.3213239\n10.1101/234039\n10.1109/eurosp.2018.00020\n10.1038/s41598-018-19987-7\n10.1038/s41398-018-0158-y`);
  const [checkStatus, setcheckStatus] = useState({ 'Fetchable': [], 'Error': [], 'Existing': [] });
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
      <Container className={classes.root}>
        <textarea className={classes.body} id="user_input" rows="20" cols="60" onChange={handleTextAreaChange}>{textarea}
        </textarea>
        <Container>
          <Typography>Fetchable DOI(s):</Typography>
          {checkStatus.Fetchable.map(status => <Typography>{status}</Typography>)}
          <Typography>Error DOI(s):</Typography>
          {checkStatus.Error.map(status => <Typography>{status}</Typography>)}
          <Typography>Stored DOI(s):</Typography>
          {checkStatus.Existing.map(status => <Typography>{status}</Typography>)}
        </Container>
      </Container>
      <Button className={classes.subButton} variant="contained" color="secondary" onClick={textAreaCheck}> Check </Button>
      <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}> Submit </Button>
      {/* <Container>
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