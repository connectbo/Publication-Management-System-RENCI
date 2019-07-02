import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

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
                <Button href="/" color="inherit">Home</Button>
                <Button href="/search" color="inherit">Search</Button>
                <Button href="/add" color="inherit">Add</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header;