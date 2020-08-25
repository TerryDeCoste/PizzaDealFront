import React from 'react';
import classes from './StarIcons.module.css';

export default (props) => {
    let rating = props.rating || 1;
    if (rating < 1) {
        rating = 1;
    }
    
    const starOutput = [1,2,3,4,5].map(count => {
        if (rating > count - 0.25){
            return <span key={count} className={[classes.ratingStar, classes.fullStar].join(' ')}></span>
        } else if (rating > count - 0.75){
            return <span key={count} className={[classes.ratingStar, classes.halfStar].join(' ')}></span>
        } else {
            return <span key={count} className={[classes.ratingStar, classes.emptyStar].join(' ')}></span>
        }
    });

    return (
        <div className={classes.ratingBox}>
            {starOutput}
        </div>
    )
}