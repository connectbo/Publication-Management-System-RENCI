import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { Checkbox, FormGroup, FormLabel, FormControl, FormControlLabel } from '@material-ui/core';

const useStyles = makeStyles({
  body: {
    fontSize: 18,
    padding: '8px 8px',
  },
  card: {
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
  const [sdate, setSDate] = useState('2001-01-01');
  const [edate, setEDate] = useState('2019-07-09');
  const [categories, setCategories] = useState([]);
  const currentUrl = window.location.hostname;
  let categoryString = "";
  let toReport = {};

  async function fetchData() {
    const categoryResults = await fetch(`http://${currentUrl}:5000/category`)
      .then(res => res.json());
    setCategories(categoryResults);
    const pubData = await fetch(`http://${currentUrl}:5000`)
      .then(res => res.json())
      .then(data => setpubArrayState(data.content));
  }

  useEffect(() => {fetchData();}, []);

  const [categoryJSON, setcategoryJSON] = useState({});
  const [categoryArray, setcategoryArray] = useState([]);
  if (Object.keys(categoryJSON).length === 0) {
    categories.forEach(function (category) {
      let curr_cate = category['Category'];
      categoryJSON[curr_cate] = true;
      categoryArray.push(curr_cate);
      setcategoryArray(categoryArray);
    })
  }



  const handle_edate_Change = event => {
    setEDate(event.target.value);
  }

  const handle_sdate_Change = event => {
    setSDate(event.target.value);
  }

  const handlerefChange = event => {
    setrefState(event.target.value);
  }

  const handleTitleChange = event => {
    setTitleState(event.target.value);
  }

  const handleAuthorChange = event => {
    setAuthorState(event.target.value);
  }

  const handleCategoryChange = event => {
    let TargetName = event.target.value;
    console.log(event.target.checked);
    let newcategoryJSON = JSON.parse(JSON.stringify(categoryJSON));
    newcategoryJSON[TargetName] = event.target.checked;
    setcategoryJSON(newcategoryJSON);
  }

  function categorytoString() {
    for (let category in categoryJSON) {
      if (categoryJSON[category] === true) {
        categoryString = categoryString + category.substr(0, 1);
      }
    }
  }

  const handleSubmit = event => {
    if (ref !== '') {
      fetch(`http://${currentUrl}:5000/reference/${ref}`)
        .then(res => res.json())
        .then(data => {
          setpubArrayState([data]);
        })
    }
    else {
      setStatusState('Searching by ' + title + " " + author);
      event.preventDefault();
      categorytoString();
      fetch(`http://${currentUrl}:5000/search/title=${title}&&author=${author}&&type=${categoryString}&&s_date=${sdate}&&e_date=${edate}`)
        .then(res => res.json())
        .then(data => {
          setpubArrayState(data);
          data.forEach(pub => {
            let curr_type = pub.Type;
            if(toReport[curr_type]){
              toReport[curr_type]+=1;
            }
            else{
              toReport[curr_type] = 1;
            }
          })
          setStatusState(JSON.stringify(toReport));
        })
    }
  }
  return (
    <div>
      <Container className={classes.root}>
        <Typography><strong>DOI</strong></Typography><Input className={classes.input} id="ref" type="text" value={ref} onChange={handlerefChange}></Input>
        <Typography className={classes.input}><strong>Title</strong></Typography><Input className={classes.input} id="title" type="text" value={title} onChange={handleTitleChange}></Input>
        <Typography className={classes.input}><strong>Author</strong></Typography><Input className={classes.input} id="author" type="text" value={author} onChange={handleAuthorChange}></Input>
        <FormControl className={classes.input}>
          <FormLabel><strong>Type</strong></FormLabel>
          <FormGroup>
            {categoryArray.map(cate => <FormControlLabel control={<Checkbox checked={categoryJSON[cate]} onChange={handleCategoryChange} value={cate} />} label={cate} ></FormControlLabel>)}
          </FormGroup>
        </FormControl>
        <FormControl>
          <TextField className={classes.input} id="sdate" label="Start Date" type="date" value={sdate} onChange={handle_sdate_Change} InputLabelProps={{
            shrink: true,
          }} ></TextField>
          <TextField className={classes.input} id="edate" label="End Date" type="date" value={edate} onChange={handle_edate_Change} InputLabelProps={{
            shrink: true,
          }}></TextField>
        </FormControl>
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
            <Typography className={classes.body}><strong>Type: </strong>{pub.Type}</Typography>
          </CardContent>
        </Card>)
        }
      </Container>
    </div>
  );
}

export default Search;