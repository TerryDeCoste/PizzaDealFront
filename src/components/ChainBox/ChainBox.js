import React from 'react';
import classes from './ChainBox.module.css';

import StarIcons from '../DealBox/StarIcons/StarIcons';

const chainbox = (props) => {
    //create deal display    
    const deals = props.info.deals.map((deal, i) => {
        const specialTop = deal.itemObjs.find(item => item.option && item.option.name === 'premium_topping');
        let description = null;
        if (specialTop){
            description = <p>{deal.description}</p>;
        }

        return (
            <div key={i} className={classes.DealBoxes}>
                <div className={classes.DealLeft}>
                    <div className={classes.DealName}>{deal.dealname}</div>
                    <div className={classes.ItemBox}>
                        <ul className={classes.ItemList}>
                            {deal.items.map((item, j) => (
                                <li key={j}>{item}</li>
                            ))}
                        </ul>
                        {description}
                    </div>
                </div>
                <div className={classes.FlagBox}>
                    {deal.price * deal.count === props.bestPrice ? <div className={classes.BestPrice}>Best Price</div> : ''}
                    {deal.value === props.bestValue ? <div className={classes.BestValue}>Best Value</div> : ''}
                </div>
                <div className={classes.PriceBox}>
                    <table className={classes.PriceTable}><tbody>
                        <tr>
                            <td className={classes.PriceLabel}><span className={classes.PriceValue}>{Number(deal.count)}</span> at</td>
                            <td className={classes.PriceValue}>${Number(deal.price).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className={classes.PriceLabel}>Total</td>
                            <td className={classes.PriceTotalValue}>${(Number(deal.price) * Number(deal.count)).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className={classes.PriceLabel}>Value</td>
                            <td className={classes.PriceValue}>{deal.value.toFixed(1)}/5</td>
                        </tr>
                    </tbody></table>
                    <StarIcons rating={deal.value}/>
                </div>
            </div>
        )
    });

    return (
        <div className={classes.ChainBox}>
            <div className={classes.LeftColumn}>
                <div className={classes.Logo}>
                    <a href={props.info.store.website} className={classes.LogoLink}>
                        <img className={classes.LogoImg} 
                            src={"/images/" + props.info.store.logo} 
                            alt={props.info.store.logo} />
                    </a> 
                </div>
                <div className={classes.ChainName}>
                    {props.info.name}
                </div>
                <div className={classes.Distance}>
                    {props.info.distance.toFixed(1)} km
                </div>
            </div>
            <div className={classes.RightColumn}>
                {deals}
            </div>
        </div>
    )
}


export default chainbox;