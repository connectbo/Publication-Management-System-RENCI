import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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
    margin: '10px 5px',
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
  },
  barTitle:{
    flexGrow: 1,
  }
});

function App() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge='start' color="inherit" aria-label="Menu">
          </IconButton>
          <Typography href="/" className={classes.barTitle}>
            <strong>RENCI</strong> Publication Management System
          </Typography>
          <Button href="/search" color="inherit">Search</Button>
        </Toolbar>
      </AppBar>
      <Router>
        <div>
          <Route path="/search" component={Search} />
          <Route path="/" exact component={Home} />
        </div>
      </Router>
    </div>
  );
}

function Home() {
  const classes = useStyles();
  const [pubs, setPubState] = useState('');
  //const [pubAuthor, setpubAuthor] = useState('');

  const getPubs = async () => {
    const PubResult = await fetch(`http://localhost:5000`)
      .then(res => res.json());
    setPubState(PubResult);
  }

  useEffect(getPubs, []);

  const pubArray = [];
  Object.keys(pubs).forEach(function(key){
    pubArray.push(pubs[key]);
  })
  console.log(pubs);
  console.log(typeof pubs);

  return (
    <Container>
      {
        pubArray.map(pub => <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.body}><strong>Title: </strong> {pub.Title}</Typography>
            <Typography className={classes.body}><strong>DOI: </strong>{pub.DOI}</Typography>
            <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
            <Typography className={classes.body}><strong>Type: </strong> {pub.Type}</Typography>
          </CardContent>
        </Card>)
      }
      </Container>
  );
}

function Search() {
  console.log("Search visited!");
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
