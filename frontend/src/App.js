import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Home from './components/Home';
import Search from './components/Search';

const useStyles = makeStyles({
  barTitle: {
    flex: 1,
    textDecoration: 'none',
    color: 'white',
  }
});

function App() {
  const classes = useStyles();
  return (
      <Router>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge='start' color="inherit" aria-label="Menu">
            </IconButton>
            <Link to="/" color="inherit" className={classes.barTitle}>
              <strong>RENCI </strong> Publication Management System
          </Link>
            <Button href="/" color="inherit">Home</Button>
            <Button href="/search" color="inherit">Search</Button>
          </Toolbar>
        </AppBar>
        <div>
          <Route path="/search" component={Search} />
          <Route path="/" exact component={Home} />
        </div>
      </Router> 
  );
}

export default App;
