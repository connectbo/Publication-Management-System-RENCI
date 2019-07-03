import React, { useState } from 'react';
//import { BrowserRouter as Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { Radio, RadioGroup, FormLabel, FormControl, FormControlLabel } from '@material-ui/core';

const useStyles = makeStyles({
  body: {
    fontSize: 18,
    padding: '8px 8px',
  },
  card:{
    margin: '10px 5px',
  },
  subButton: {
    marginLeft: 10,
  },
  root: {
    padding: '12px 12px',
    display: 'flex',
    alignItems: 'center',
    width: 1100,
  },
  input: {
    marginLeft: 10,
  }
});


function Search() {
  const classes = useStyles();
  const [ref, setrefState] = useState('');
  const [title, setTitleState] = useState('');
  const [author, setAuthorState] = useState('');
  const [pubArray, setpubArrayState] = useState([]);
  const [status, setStatusState] = useState('');

  const handlerefChange = event => {
    setrefState(event.target.value);
  }

  const handleTitleChange = event => {
    setTitleState(event.target.value);
  }

  const handleAuthorChange = event => {
    setAuthorState(event.target.value);
  }

  const handleSubmit = event => {
    setStatusState('Searching by '+title+" "+author);
    event.preventDefault();
    fetch(`http://localhost:5000/search/title=${title}&&author=${author}`)
      .then(res => res.json())
      .then(data => {
        setpubArrayState(data);
      })
  }
  return (
    <div>
      <Container className={classes.root}>
        <Typography><strong>DOI</strong></Typography><Input className={classes.input} id="ref" type="text" value={ref} onChange={handlerefChange}></Input>
        <Typography className={classes.input}><strong>Title</strong></Typography><Input className={classes.input} id="title" type="text" value={title} onChange={handleTitleChange}></Input>
        <Typography className={classes.input}><strong>Author</strong></Typography><Input className={classes.input} id="author" type="text" value={author} onChange={handleAuthorChange}></Input>
        <FormControl>
          <FormLabel><strong>Type</strong></FormLabel>
        <RadioGroup className={classes.input}>
          <FormControlLabel value="female" control={<Radio />} label="Book Chapter"></FormControlLabel>
          <FormControlLabel value="female" control={<Radio />} label="Journal Article"></FormControlLabel>
          <FormControlLabel value="female" control={<Radio />} label="Proceedings Article"></FormControlLabel>
        </RadioGroup>
        </FormControl>
        {/* <Typography><strong>Type</strong></Typography><Input className={classes.input} id="type" type="text" value={author} onChange={handleAuthorChange}></Input> */}
        <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}>
          Search </Button>
      </Container>
      <Typography className={classes.body}><strong>{status}</strong></Typography>
      <Container>
        {pubArray.map(pub => <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.body}><strong>Title: </strong> {pub.Title}</Typography>
            <Typography className={classes.body}><strong>DOI: </strong><a href={"https://dx.doi.org/" + pub.DOI}>{pub.DOI}</a></Typography>
            <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
            <Typography className={classes.body}><strong>Created Date: </strong>{pub.Created_Date}</Typography>
            <Typography className={classes.body}><strong>Type: </strong>{pub.Type }</Typography>
          </CardContent>
        </Card>)
        }
      </Container>
    </div>
  );
}

export default Search;