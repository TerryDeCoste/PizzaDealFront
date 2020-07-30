import React from 'react';

import DealBox from '../../components/DealBox/DealBox';

const searchoutput = (props) => {
    let html = null;
    if (props.deals && props.deals.length > 0) {
        html = props.deals.map((deal, i) => <DealBox key={i} info={deal}></DealBox>);
    }
    if (!html && !props.initial){
        html = <h3>No deals found, please check your criteria.</h3>
    }
    
    return (
        <div>
            {html}
        </div>
    )
}

export default searchoutput;