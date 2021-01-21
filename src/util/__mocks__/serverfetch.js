const BASE_URL = "http://localhost:3030";

import itemOptionsResponse from './itemoptions.mock.json';
import providersResponse from './providers.mock.json';
import topDealsResponse from './topdeals.mock.json';
import locationLatLonResponse from './location.latlon.mock.json';
import locationTypeResponse from './location.type.mock.json';
import searchDefaultResponse from './search.default.mock.json';
import searchNoResultResponse from './search.noresults.mock.json';
import searchByChainDefaultResponse from './searchbychain.mock.json';
import searchByChainNoResultResponse from './searchbychain.noresults.mock.json';

module.exports = jest.fn((url, data={}) => {
    //check url and return json
    if (url.endsWith('/itemoptions')){
        return Promise.resolve(itemOptionsResponse);
    }
    if (url.endsWith('/providers')){
        return Promise.resolve(providersResponse);
    }
    if (url.endsWith('/topdeals')){
        return Promise.resolve(topDealsResponse);
    }
    if (url.endsWith('/search')){
        if (data.location.text === 'City, Province or Postal Code'
            && data.priceLimit === 'all'
            && data.deliveryRequired === 'no'
            && data.orderBy === 'price'
            && data.items.length === 0
        ){
            return Promise.resolve(searchDefaultResponse);      
        }
        return Promise.resolve(searchNoResultResponse);
    }
    if (url.endsWith('/searchbychain')){
      if (data.location.text === 'City, Province or Postal Code'
          && data.priceLimit === 'all'
          && data.deliveryRequired === 'no'
          && data.orderBy === 'price'
          && data.items.length === 0
      ){
          return Promise.resolve(searchByChainDefaultResponse);      
      }
      return Promise.resolve(searchByChainNoResultResponse);
  }

    console.log("SERVER FETCH MOCK URL NOT MATCHED:", url);
    console.log("SERVER FETCH MOCK DATA NOT MATCHED:", data);
    return Promise.reject();
});