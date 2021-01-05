import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Checkbox, FormGroup, FormLabel, FormControl, FormControlLabel } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import { ResponsivePie } from '@nivo/pie';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const useStyles = makeStyles({
  body: {
    fontSize: 18,
    padding: '8px 8px',
  },
  card: {
    margin: '10px 5px',
  },
  subButton: {
    marginLeft: 30,
    marginTop:10,
    color: 'white',
    backgroundColor: '#078AC1'
  },
  root: {
    padding: '12px 12px',
    display: 'flex',
    alignItems: 'center',
    width: 1100,
  },
  input: {
    marginLeft: 10,
  },
  pie_chart: {
    padding: '12px 12px',
    height: 350
  },
  chart: {
    padding: '12px 12px'
  }
});


function Search() {
  const classes = useStyles();

  const [ref, setrefState] = useState('');
  const [title, setTitleState] = useState('');
  const [author, setAuthorState] = useState('');
  const [pubArray, setpubArrayState] = useState([]);
  const [status, setStatusState] = useState([]);
  const [sdate, setSDate] = useState('2001-01-01');
  const [edate, setEDate] = useState('2020-01-01');
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [page, setCurrentPage] = useState(1);
  const [currentPubArray, setcurrentPubArray] = useState([]);

  const pageLimit = 10;

  const currentUrl = window.location.hostname;
  let categoryToSend = [];
  let toReport = {};
  let csvContent = "data:application/octet-stream,";

  async function fetchCategories() {
    const categoryResults = await fetch(`http://${currentUrl}:5000/category`)
      .then(res => res.json());
    setCategories(categoryResults);
    handleSubmit();
  }

  useEffect(() => { fetchCategories(); }, []);

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

  const handleExport = () => {
    pubArray.forEach(pub => {
      csvContent += encodeURIComponent(pub['Citation'] + "\r\n\n");
    })
    window.open(csvContent);
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
    let newcategoryJSON = JSON.parse(JSON.stringify(categoryJSON));
    newcategoryJSON[TargetName] = event.target.checked;
    setcategoryJSON(newcategoryJSON);
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setcurrentPubArray(pubArray.slice((value - 1) * 10, value * 10));
  }

  function checkCategory(categoryJSON) {
    for (let i in categoryJSON) {
      console.log(i);
      console.log(categoryJSON[i]);
      if (categoryJSON[i] === true) {
        return true;
      }
    }
    return false;
  }

  function generateHslaColors(saturation, lightness, alpha, amount) {
    let colors = []
    let huedelta = Math.trunc(360 / amount)

    for (let i = 0; i < amount; i++) {
      let hue = i * huedelta
      colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
    }
    return colors;
  }


  function handleSubmit() {
    let toReportJSON = [];
    setLoading(true);
    if (ref !== '') {
      fetch(`http://${currentUrl}:5000/reference/${ref}`)
        .then(res => res.json())
        .then(data => {
          setpubArrayState([data]);
        })
    }
    else {
      if (checkCategory(categoryJSON)) {
        fetch(`http://${currentUrl}:5000/search/title=${title}&&author=${author}&&type=${JSON.stringify(categoryJSON)}&&s_date=${sdate}&&e_date=${edate}`)
          .then(res => res.json())
          .then(data => {
            setpubArrayState(data);
            setcurrentPubArray(data);
            data.forEach(pub => {
              let curr_type = pub.Type;
              if (toReport[curr_type]) {
                toReport[curr_type] += 1;
              }
              else {
                toReport[curr_type] = 1;
              }
            });
            let hslcolors = generateHslaColors(50, 100, 1.0, Object.keys(toReport).length);
            let counter = 0;
            Object.keys(toReport).forEach(key => {
              toReportJSON.push({ "id": key, "label": key, "value": toReport[key], "color": hslcolors[counter++] });
            })
            setStatusState(toReportJSON);
            setLoading(false);
          })
      }
      else {
        setpubArrayState([]);
        setcurrentPubArray([]);
        setLoading(false);
      }
    }
  }

// basic working design
// backend api work


  return (
    <div>
      <Container className={classes.root}>
        {/* <Typography><strong>DOI</strong></Typography><Input className={classes.input} id="ref" type="text" value={ref} onChange={handlerefChange}></Input> */}
        <Typography className={classes.input}><strong>Title</strong></Typography><Input className={classes.input} id="title" type="text" value={title} onChange={handleTitleChange}></Input>
        <Typography className={classes.input}><strong>Author</strong></Typography><Input className={classes.input} id="author" type="text" value={author} onChange={handleAuthorChange}></Input>
        <FormControl className={classes.input}>
          <FormLabel><strong>Category Filter</strong></FormLabel>
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
        <Button className={classes.subButton} variant="contained" color='primary' onClick={handleSubmit}>
          Search </Button>
      </Container>
      <Container>
        {isLoading == true ? <CircularProgress /> :
          <Tabs>
            <TabList>
              <Tab>Result</Tab>
              <Tab>Result Data Visualization</Tab>
              <Tab>Download Citation</Tab>
            </TabList>

            <TabPanel>
              <Pagination count={Math.ceil(pubArray.length / 10)} color="primary" page={page} onChange={handlePageChange} />
              {currentPubArray.length > 0 ?
                currentPubArray.map(pub => <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.body}><strong>Title: </strong> {pub.Title}</Typography>
                    <Typography className={classes.body}><strong>DOI: </strong><a href={"https://dx.doi.org/" + pub.DOI}>{pub.DOI}</a></Typography>
                    <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors}</Typography>
                    <Typography className={classes.body}><strong>Created Date: </strong>{pub.Created_Date}</Typography>
                    <Typography className={classes.body}><strong>Type: </strong>{pub.Type}</Typography>
                    <Typography className={classes.body}><strong>Citation: </strong>{pub.Citation}</Typography>
                  </CardContent>
                </Card>)
                : <Typography className={classes.body}>No results found. </Typography>
              }
            </TabPanel>
            <TabPanel>
              <Typography className={classes.body}>In total, {pubArray.length} result(s) are found.</Typography>
              <Container className={classes.pie_chart}>
                <ResponsivePie 
                  className={classes.chart} 
                  data={status}
                  margin={{ top: 25, bottom: 25, left: 25, right: 25 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  colors={{ scheme: 'nivo' }}
                  borderWidth={1}
                  borderColor={{ theme: 'background' }}
                  radialLabelsLinkOffset={4}
                  radialLabelsTextColor="#333333"
                  radialLabelLinkColor="black"
                  animate={true} />
              </Container>
            </TabPanel>
            <TabPanel>
              <Button className={classes.subButton} variant="contained" color='primary' onClick={handleExport}>Download Citations</Button>
              <Container>
                {pubArray.map(pub =>
                  <Typography className={classes.body}>{pub.Citation}</Typography>
                )}
              </Container>
            </TabPanel>
          </Tabs>
        }
      </Container>
    </div>
  );
}

export default Search;