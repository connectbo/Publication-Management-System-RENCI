import React, { useState, useEffect } from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
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
    }
});

function Home() {
    const classes = useStyles();
    const [pubs, setPubState] = useState('');
    const [status, setStatus] = useState('');
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

    const searchbyType = async (event, type) => {
        const PubResult = await fetch(`http://localhost:5000/reference/type/${type}`)
            .then(res => res.json());
        setPubState(PubResult);
        setStatus('Filtered by '+type);
    } 

    return (
        <Container>
            <Typography className={classes.body}><strong>{status}</strong> </Typography>
            {
                pubArray.map(pub => <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.body}><strong>Title: </strong> {pub.Title}</Typography>
                        <Typography className={classes.body}><strong>DOI: </strong><a href={"https://dx.doi.org/"+pub.DOI}>{pub.DOI}</a></Typography>
                        <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
                        <Typography className={classes.body}><strong>Created Date: </strong>{pub.Created_Date}</Typography>
                        <Typography className={classes.body}><strong>Type: </strong> <a href={"/search/type="+pub.Type} onClick={(e) => {searchbyType(e,pub.Type)}}> {pub.Type}</a> </Typography>
                    </CardContent>
                </Card>)
            }
        </Container>
    );
}
export default Home;