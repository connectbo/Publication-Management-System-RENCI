import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { navigate } from '@reach/router';

const useStyles = makeStyles(theme => ({
    login: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        margin: theme.spacing(2)
    },
    submit: {
        marginTop: theme.spacing(2)
    },
    status: {
        color: 'red'
    }
}))

function AdminLogin() {
    const classes = useStyles();
    const currentUrl = window.location.hostname;
    const [status, setStatus] = useState();

    const Authenticate = () => {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        const loginResult = axios(`http://${currentUrl}:5000/commsLogin`, {
            method: 'POST',
            params: {
                Username: username,
                Password: password
            }
        }).then(res => {
            if (res.data.message == 'Success') {
                localStorage.setItem('authenticate', '1');
                navigate('/admin', { replace: true })
            }
            else {
                setStatus("Incorrect Username or Password. Please try again.")
            }
        }).catch(e => {
            console.log(e);
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.login}>
                <Typography>Comms Login</Typography>
                <div className={classes.form}>
                    <TextField
                        id="username"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                    />
                    <TextField
                        id="password"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        type="password"
                        label="Password"
                    />
                    <Button
                        className={classes.submit}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={Authenticate}
                    >Login</Button>
                    <Typography className={classes.status}>{status}</Typography>
                </div>
            </div>
        </Container>
    )
}

export default AdminLogin;