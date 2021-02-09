import React from 'react';
import { Link } from '@reach/router';
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
    },
    header:{
        backgroundColor: '#00758d'
    }
});

function Header() {
    const classes = useStyles();
    return (
        <AppBar className={classes.header} position="static">
            <Toolbar variant="dense">
                <IconButton edge='start' color="inherit" aria-label="Menu">
                </IconButton>
                <a href="/" color="inherit" className={classes.barTitle}>
                    <strong>RENCI </strong> Publication Management System
          </a>
                <Button component={Link} to="/" color="inherit">Home</Button>
                <Button component={Link} to="/publications" color="inherit">Publications</Button>
                <Button component={Link} to="/add" color="inherit">Add</Button>
                <Button component={Link} to="/login" color="inherit">Admin</Button>
                {/* <Button component={NavLink} to="add_Input" color="inherit">Add Manually</Button> */}
            </Toolbar>
        </AppBar>
    )
}

export default Header;