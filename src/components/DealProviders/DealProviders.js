import React from 'react';
import classes from './DealProviders.module.css';

const dealproviders = (props) => {
    let html = null;
    if (props.providers && props.providers.length > 0) {
        html = props.providers.map((provider, i) => (
            <li key={i} className={classes.ProviderSub}>
                <a href={provider.website} className={classes.ProviderLink}>
                    <img className={classes.Provider} 
                        src={"/images/" + provider.logo} 
                        alt={provider.logo} />
                </a> 
            </li>
        ));
    }

    if (html == null){
        return null;
    }

    return (
        <div className={classes.Container}>
            <div className={classes.Label}>With deals from:</div>
            <ul className={classes.ProviderBox}>
                {html}
            </ul>
        </div>
    )
}

export default dealproviders;