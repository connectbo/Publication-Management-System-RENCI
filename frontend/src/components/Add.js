import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles({
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
  
  function Add() {
      console.log("Add visited!");
      const classes = useStyles();
      const [ref, setrefState] = useState('');
      const [result, setResultState] = useState('');
      const [authorString, setAuthorStringState] = useState('');
    
      const handleChange = event => {
        setrefState(event.target.value);
      }
    
      const handleSubmit = event => {
        event.preventDefault();
        fetch(`http://localhost:5000/reference/${ref}/save=yes`)
          .then(res => res.json())
          .then(data => {
            setResultState(data);
            setAuthorStringState(data.Authors.join(', '));
          })
      }
    
      return (
        <div>
          <Container className={classes.root}>
            <Typography><strong>PubFinder</strong></Typography>
            <Input className={classes.input} id="ref" type="text" placeholder="Enter DOI to add Publications.." value={ref} onChange={handleChange}></Input>
            <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}>
              ADD </Button>
          </Container>
          <Typography className={classes.body}><strong>   Result :  </strong>{result.status}</Typography>
          <Container>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.body}><strong>Title: </strong> {result.Title}</Typography>
                <Typography className={classes.body}><strong>DOI: </strong>{result.DOI}</Typography>
                <Typography className={classes.body}><strong>Author(s): </strong>{authorString}</Typography>
                <Typography className={classes.body}><strong>Type: </strong> {result.Type}</Typography>
              </CardContent>
            </Card>
          </Container>
        </div>
      );
    }
  
  export default Add;