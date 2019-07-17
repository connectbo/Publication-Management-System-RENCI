import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    barTitle: {
        flex: 1,
        textDecoration: 'none',
        color: 'white',
    }
});

function Header() {
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton edge='start' color="inherit" aria-label="Menu">
                </IconButton>
                <a href="/" color="inherit" className={classes.barTitle}>
                    <strong>RENCI </strong> Publication Management System
          </a>
                <NavLink component={Button} to="/" color="inherit">Home</NavLink>
                <Link component={Button} to="/search" color="inherit">Search</Link>
                <NavLink component={Button} to="/add" color="inherit">Add</NavLink>
            </Toolbar>
        </AppBar>
    )
}

export default Header;