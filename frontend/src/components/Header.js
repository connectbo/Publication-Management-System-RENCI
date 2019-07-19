import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

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
                <Button component={NavLink} to="/" color="inherit">Home</Button>
                <Button component={NavLink} to="/search" color="inherit">Search</Button>
                <Button component={NavLink} to="/add" color="inherit">Add</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header;