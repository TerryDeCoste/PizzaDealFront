import React from 'react';
import Image from './Logo.jpg';
import classes from './Logo.module.css';

const logo = (props) => {
    return (
        <React.Fragment>
            <img src={Image} alt="logo" className={classes.Image}/>
            <h1 className={classes.Text}>Find My Pizza Deal!</h1>
        </React.Fragment>
    )
}

export default logo;