import React, { useState, useEffect } from 'react';
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

    const getPubs = async () => {
        const PubResult = await fetch(`http://localhost:5000`)
            .then(res => res.json());
        setPubState(PubResult);
    }

    useEffect(getPubs, []);

    const pubArray = [];
    Object.keys(pubs).forEach(function (key) {
        pubArray.push(pubs[key]);
    })
    console.log(pubs);
    console.log(typeof pubs);

    return (
        <Container>
            {
                pubArray.map(pub => <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.body}><strong>Title: </strong> {pub.Title}</Typography>
                        <Typography className={classes.body}><strong>DOI: </strong>{pub.DOI}</Typography>
                        <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
                        <Typography className={classes.body}><strong>Type: </strong> {pub.Type}</Typography>
                    </CardContent>
                </Card>)
            }
        </Container>
    );
}
export default Home;