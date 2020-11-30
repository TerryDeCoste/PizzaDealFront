import React, { useState, useEffect, useCallback } from 'react';
import Layout from './hoc/Layout/Layout';

import serverFetch from './util/serverfetch';

import TopDeals from './containers/TopDeals/TopDeals';
import SearchOutput from './containers/SearchOutput/SearchOutput';
import DealProviders from './components/DealProviders/DealProviders';
import SearchBox from './containers/SearchBox/SearchBox';


const App = (props) => {
  //set Initial States
  const [topDeals, setTopDeals] = useState(null);
  const [dealInfo, setDealInfo] = useState(null);
  const [providers, setProviders] = useState(null);
  const [searchDisplay, setSearchDisplay] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [initial, setInitial] = useState(true);
  
  //on first load, pull deal providers and top deals
  const onInitTopDeals = useCallback(() => {
    //get top deals
    serverFetch('/topdeals')
    .then(response => {
      setTopDeals(response);
    })
  }, [setTopDeals]);
  const onInitProviders = useCallback(() => {
    //get providers
    serverFetch('/providers')
    .then(response => {
      setProviders(response);
    })
  }, [setProviders]);

  useEffect(() => {
    onInitTopDeals();
    onInitProviders();
}, [onInitTopDeals, onInitProviders]);

  //search trigger
  const onSearchClick = () => {
    if (!searchDisplay) {
      setSearchDisplay(true);
    } else {
      serverFetch('/searchbychain', searchCriteria)
      .then(response => {
        setDealInfo(response);
        setSearchDisplay(false);
        setInitial(false);
      });
    }
  }

  return (
    <Layout>
      <TopDeals deals={topDeals}></TopDeals>
      
      <SearchBox searchClick={onSearchClick} searchDisplay={searchDisplay} setSearchCriteria={setSearchCriteria}></SearchBox>
      <SearchOutput deals={dealInfo} initial={initial} backClick={onSearchClick} ></SearchOutput>

      <DealProviders providers={providers} ></DealProviders>
    </Layout>
  );
}

export default App;
