import React from 'react';
import classes from './Disclaimer.module.css';

const disclaimer = (props) => {
    return (
        <div className={classes.Box}>
            <p className={classes.Disclaimer}>All data is provided on an as-is basis, and prices provided here may not be honoured by the restaurants.  Please verify pricing with the restaurant prior to purchase.</p>
            <p className={classes.Copyright}>&copy; {new Date().getFullYear()} - Terry DeCoste</p>
        </div>
    )
}

export default disclaimer;