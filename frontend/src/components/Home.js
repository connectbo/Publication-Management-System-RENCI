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
    const currentUrl = window.location.hostname;
    const [pubs, setPubState] = useState('');
    const [pubs_num,setPubNumber] = useState(0);
    const [expanded, setExpanded] = useState(false);
    


    async function getPubs() {
        const PubResult = await fetch(`http://${currentUrl}:5000/`)
            .then(res => res.json());
        setPubNumber(PubResult.status);
        setPubState(PubResult.content);
    }

    useEffect(()=>{getPubs();}, []);

    const pubArray = [];
    Object.keys(pubs).forEach(function (key) {
        pubArray.push(pubs[key]);
    })

    const handleExpandChange = curr_doi => (event, isExpanded) => {
        setExpanded(isExpanded ? curr_doi : false);
    };

    return (
        <Container>
            <Typography className={classes.heading}>{`Showing ${pubs_num} results in RENCI database`} </Typography>
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
                            <Typography className={classes.body}><strong>Author(s): </strong>{pub.Authors.join(", ")}</Typography>
                            <Typography className={classes.body}>Published on <strong>{pub.Created_Date}</strong>, Category: <strong>{pub.Type}</strong></Typography><hr />
                            <Typography className={classes.body}><strong>Citation: </strong> {pub.Citation}</Typography>
                        </Container>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </Container>
    );
}
export default Home;