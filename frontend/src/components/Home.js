import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    card: {
        marginTop: 10
    },
    title: {
        fontSize: 14,
        paddingTop: '10px',
        paddingBottom: '8px'
    },
    body: {
        fontSize: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: theme.typography.fontWeightRegular,
    }
}));

function Home() {
    const classes = useStyles();
    const [pubs, setPubState] = useState('');
    const [expanded, setExpanded] = useState(false);
    const getPubs = async () => {
        const PubResult = await fetch(`http://localhost:5000/`)
            .then(res => res.json());
        setPubState(PubResult);
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
            {/* <div className='initial-loading'>
                <ClipLoader sizeUnit={"px"} size={150} color={'#123abc'} loading={isLoading}></ClipLoader>
            </div> */}
            <Typography className={classes.title}>{pubs.status} </Typography>
            {pubArray.map(pub =>
                <ExpansionPanel className={classes.card} expanded={expanded === pub.DOI} onChange={handleExpandChange(pub.DOI)}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <Container>
                            <Typography className={classes.heading}><strong>{pub.Title}</strong></Typography>
                            <Typography block><a href={"https://dx.doi.org/" + pub.DOI}>{pub.DOI}</a></Typography>
                        </Container>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Container>
                            <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography><hr />
                            <Typography className={classes.body}>Published on <strong>{pub.Created_Date}</strong>, Category: <strong>{pub.Type}</strong></Typography>
                        </Container>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </Container>
    );
}
export default Home;