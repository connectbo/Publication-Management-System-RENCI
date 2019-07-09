import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    card: {
        margin: '10px 5px',
        minWidth: 300,
    },
    title: {
        fontSize: 20,
    },
    body: {
        fontSize: 18,
        padding: '8px 8px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    }
}));

function Home() {
    const classes = useStyles();
    const [pubs, setPubState] = useState('');
    const [status, setStatus] = useState('');
    const [expanded, setExpanded] = useState(false);
    const getPubs = async () => {
        const PubResult = await fetch(`http://localhost:5000/`)
            .then(res => res.json());
        setPubState(PubResult);
        setStatus('Showing results in RENCI Database');
    }

    useEffect(getPubs, []);

    const pubArray = [];
    Object.keys(pubs).forEach(function (key) {
        pubArray.push(pubs[key]);
    })

    const handleExpandChange = curr_doi => (event, isExpanded) => {
        setExpanded(isExpanded ? curr_doi : false);
    };

    return (
        <Container>
            <Typography className={classes.body}><strong>{status}</strong> </Typography>
            {
                pubArray.map(pub =>
                    <ExpansionPanel expanded={expanded === pub.DOI } onChange={handleExpandChange(pub.DOI)}>
                        <ExpansionPanelSummary
                            expandIcon={<Button />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{pub.Title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography className={classes.body}><strong>DOI: </strong><a href={"https://dx.doi.org/" + pub.DOI}>{pub.DOI}</a></Typography>
                            <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
                            <Typography className={classes.body}><strong>Created Date: </strong>{pub.Created_Date}</Typography>
                            <Typography className={classes.body}><strong>Type: </strong>{pub.Type}</Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    // <Card className={classes.card}>
                    //     <CardContent>
                    //         <Typography className={classes.body}><strong>Title: </strong> {pub.Title}</Typography>
                    //         <Typography className={classes.body}><strong>DOI: </strong><a href={"https://dx.doi.org/" + pub.DOI}>{pub.DOI}</a></Typography>
                    //         <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
                    //         <Typography className={classes.body}><strong>Created Date: </strong>{pub.Created_Date}</Typography>
                    //         <Typography className={classes.body}><strong>Type: </strong>{pub.Type}</Typography>
                    //     </CardContent>
                    // </Card>)
                )}
        </Container>
    );
}
export default Home;