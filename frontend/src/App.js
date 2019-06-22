import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/Menu';



import './App.css';

const useStyles = makeStyles({
  card: {
    minWidth: 300,
  },
  title: {
    fontSize: 20,
  },
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

function App() {
  const classes = useStyles();
  const [ref, setrefState] = useState('');
  const [result, setResultState] = useState('');
  const [authorString, setAuthorStringState] = useState('');

  const handleChange = event => {
    setrefState(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetch(`http://localhost:5000/reference/${ref}`)
      .then(res => res.json())
      .then(data => {
        setResultState(data);
        setAuthorStringState(data.Authors.join(', '));
      })
  }

  const savePub = event => {
    fetch(`http://localhost:5000/reference/${ref}/save=yes`)
    .then(res => res.json())
    .then(data => {
      setResultState(data);
    });
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge='start' color="inherit" aria-label="Menu">
          </IconButton>
          <Typography>
            <strong>RENCI</strong> Publication Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.root}>
        <Typography><strong>PubFinder</strong></Typography>
        <InputBase className={classes.input} id="ref" type="text" placeholder="Enter DOI to start searching.." value={ref} onChange={handleChange}></InputBase>
        <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}>
          Search </Button>
      </Container>
      <Typography className={classes.body}><strong>Search Result: </strong>{result.status}</Typography>
      <Container>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.body}><strong>Title: </strong> {result.Title}</Typography>
            <Typography className={classes.body}><strong>DOI: </strong>{result.DOI}</Typography>
            <Typography className={classes.body}><strong>Author(s): </strong>{authorString}</Typography>
            <Typography className={classes.body}><strong>Type: </strong> {result.Type}</Typography>
          </CardContent>
          <CardActions>
          {result.save ? <Button onClick={savePub} size="small" color="secondary">Save it</Button> : null}
          </CardActions>
        </Card>
      </Container>
    </div>
  );
}

export default App;
