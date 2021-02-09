import React, { useState } from 'react';
import { Button, Card, CardContent, Container } from '@material-ui/core';
import { Link } from '@reach/router';
import { makeStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

import '../App.css';

const useStyles = makeStyles({
    card: {
        backgroundColor: '#d9d9d9'
    }
})

function Home() {
    const classes = useStyles();
    const [doiText, setDoiText] = useState("I have a DOI")
    const [nondoiText, setNonDoiText] = useState("I do not have a DOI")

    return (
        <Container>
            <div className="home-text-container">
                <Card className={classes.card}>
                    <CardContent>Welcome to the RENCI Publication Management Tool. The goal of this tool is to highlight scholarship created by RENCI and its employees.</CardContent>

                    <CardContent>You can search, sort, and visualize RENCI scholarship via the Publications page.</CardContent>

                    <CardContent>In order to add an item to this site, you must be connected to the RENCI VPN and have a DOI for the item you hope to add. If you do not already have a DOI, RENCI will mint one for you. Please use the points of entry below to begin adding your scholarship.</CardContent>
                </Card>
            </div>
            <br />
            <div className="home-option-container">
                <a className="home-have-doi" href="add"><div className="home-text" onMouseEnter={() => { setDoiText("Have DOI? Let's get started.") }} onMouseOut={() => {setDoiText("I have a DOI.")}}>{doiText}</div></a>
                <a className="home-non-doi" href="https://docs.google.com/forms/d/e/1FAIpQLSdtJQ2h8qalkr6r1jIBhmJs88M_t_GVqOekdcX6zGVtgcBZAQ/viewform?usp=sf_link" target="_blank"><div className="home-text" onMouseEnter={() => { setNonDoiText("Don't have DOI? Please fill out this form.") }} onMouseOut={() => {setNonDoiText("I don't have a DOI.")}}>{nondoiText}</div></a>
            </div>
        </Container>
    )
}

export default Home;