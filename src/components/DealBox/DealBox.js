import React from 'react';
import classes from './DealBox.module.css';

const dealbox = (props) => {
    const specialTop = props.info.itemObjs.find(item => item.option && item.option.name === 'premium_topping');
    let description = null;
    if (specialTop){
        description = <p>{props.info.description}</p>;
    }
    return (
        <div className={classes.DealBox}>
            <div className={classes.Logo}>
                <a href={props.info.website} className={classes.LogoLink}>
                    <img className={classes.LogoImg} 
                        src={"/images/" + props.info.logo} 
                        alt={props.info.logo} />
                </a> 
            </div>
            <div className={classes.DealName}>{props.info.dealname}</div>
            <div className={classes.ItemBox}>
                <ul className={classes.ItemList}>
                    {props.info.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
                {description}
            </div>
            <div className={classes.PriceBox}>
                <div>$: {props.info.price}</div>
                <div>V: {props.info.value}/5</div>
                <div>   *****</div>
                <div>{props.info.distance.toFixed(1)} km</div>
            </div>
        </div>
    )
}


export default dealbox;