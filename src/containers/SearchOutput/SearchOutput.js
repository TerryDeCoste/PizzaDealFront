import React from 'react';

import ChainBox from '../../components/ChainBox/ChainBox';
import classes from './SearchOutput.module.css';

const searchoutput = (props) => {
    let html = null;
    if (props.deals && props.deals.length > 0) {
        //find best price and value for flags
        let bestPrice = 9999999;
        let bestValue = 0;
        props.deals.forEach(chain => {
            if (chain.bestprice < bestPrice){
                bestPrice = chain.bestprice;
            }
            if (chain.bestvalue > bestValue){
                bestValue = chain.bestvalue;
            }
        });

        html = props.deals.map((chain, i) => <ChainBox key={i} info={chain} bestPrice={bestPrice} bestValue={bestValue}></ChainBox>);
    }
    if (!html && !props.initial){
        html = (
            <div>
                <h3>No deals found, please check your criteria.</h3>
                <button className={classes.BackButton} id="btn_back" onClick={props.backClick}>Back to Search</button>
            </div>
        )
    }
    
    return (
        <div>
            {html}
        </div>
    )
}

export default searchoutput;