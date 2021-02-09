import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from '@reach/router';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        margin: theme.spacing(2)
    },
    insert: {
        display: 'grid',
        justify: 'center'
    },
    insert_btn: {
        marginLeft: 250,
        marginRight: 250
    }
}))

function Admin() {
    const classes = useStyles();
    const [auth, setAuth] = useState(localStorage.getItem('authenticate') !== null ? true : false);
    const currentUrl = window.location.hostname;
    const [doi, setDOI] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [cite, setCite] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('2001-01-01');
    const [status, setStatus] = useState('');


    const insertHandler = event => {
        let toSend = {
            'doi': doi,
            'title': title,
            'author': author,
            'type': type,
            'date': date
        }
        fetch(`http://${currentUrl}:5000/insert_manually`, {
            method: 'POST',
            body: JSON.stringify(toSend),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(res => {
                setStatus(res['message']);
            })
    }

    const logout = event => {
        localStorage.clear();
        setAuth(false);
    }

    return (
        <div className={classes.insert}>
            {auth ?
                <Container>
                    <Button onClick={logout}>Log out</Button>
                    <form className={classes.root}>
                        <TextField id="doi" label="DOI" onChange={doi => { setDOI(doi.target.value); }} />
                        <TextField id="title" label="Title" onChange={title => setTitle(title.target.value)} />
                        <TextField id="author" label="Author(s)" onChange={author => setAuthor(author.target.value)} />
                        <TextField id="cite" label="Citation" onChange={cite => setCite(cite.target.value)} />
                        <TextField
                            id="date"
                            label="Created Date"
                            type="date"
                            defaultValue="2001-01-01"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={date => setDate(date.target.value)}
                        />
                Type: <Select
                            labelId="type"
                            id="type"
                            value={type}
                            onChange={type => setType(type.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value='paper-conference'>Paper-Conference</MenuItem>
                            <MenuItem value='chapter'>Chapter</MenuItem>
                            <MenuItem value='Article-Journal'>Article-Journal</MenuItem>
                            <MenuItem value='presentation'>Presentation</MenuItem>
                            <MenuItem value='poster'>Poster</MenuItem>
                            <MenuItem value='software'>Software Release</MenuItem>
                            <MenuItem value='other'>Other</MenuItem>
                        </Select>
                        <Typography>{status}</Typography>
                        <br/>
                        <Button className={classes.insert_btn} variant="outlined" color="secondary" onClick={insertHandler}>Insert</Button>
                    </form>
                </Container> : <Typography>Please <Link to='/login'>log in</Link> to use this feature.</Typography>}

        </div>
    );
}

export default Admin;