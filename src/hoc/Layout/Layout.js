import React from 'react';
import classes from './Layout.module.css';

import Logo from '../../components/Logo/Logo';
//import Subheader
//import DealProviders
import Disclaimer from '../../components/Disclaimer/Dislaimer';

const layout = (props) => {
    

    return(
        <div className={classes.Container}>
            <header className={classes.TopBar}>
                <div id="logo" className={classes.Logo}><Logo></Logo></div>
            </header>
            <main className={classes.Content}>
                {props.children}
            </main>
            <footer id="disclaimer" className={classes.Disclaimer}><Disclaimer></Disclaimer></footer>
        </div>
    )
}

export default layout;