import React, {useState, useEffect, useCallback} from 'react';
import classes from './SearchBox.module.css';

import serverFetch from '../../util/serverfetch';

import SearchOption from '../../components/SearchOption/SearchOption';

const searchOptions = [
    {
        name: "Location",
        display: "Location",
        type: "Location",
    },
    {
        name: "PriceLimit",
        display: "Price Limit",
        type: "Dropdown",
        options: [
            { key: "all", display: "No Limit" }, 
            { key: "5", display: "$5.00" }, 
            { key: "10", display: "$10.00" }, 
            { key: "15", display: "$15.00" }, 
            { key: "20", display: "$20.00" }, 
            { key: "25", display: "$25.00" }, 
            { key: "30", display: "$30.00" }, 
            { key: "35", display: "$35.00" }, 
            { key: "40", display: "$40.00" }, 
            { key: "45", display: "$45.00" }, 
            { key: "50", display: "$50.00" }, 
            { key: "60", display: "$60.00" }, 
            { key: "70", display: "$70.00" }, 
            { key: "80", display: "$80.00" }, 
            { key: "90", display: "$90.00" }, 
            { key: "100", display: "$100.00" }, 
            { key: "150", display: "$150.00" }, 
            { key: "200", display: "$200.00" }, 
        ],
    },
    {
        name: "Delivery",
        display: "Delivery Required",
        type: "Dropdown",
        options: [
            { key: "no", display: "No" }, 
            { key: "yes", display: "Yes" }, 
        ],
    },
    {
        name: "OrderBy",
        display: "Order By",
        type: "Dropdown",
        options: [
            { key: "price", display: "Lowest Price" }, 
            { key: "value", display: "Best Value" }, 
            { key: "distance", display: "Closest Store" }, 
        ],
    },
    {
        name: "Items",
        display: "Items",
        type: "Items",
        options: [],
    },
]

export default (props) => {
    const [timeText, setTimeText] = useState(null);
    //default location London, ON
    const [location, setLocation] = useState({
        text: "City, Province or Postal Code",
        latitude: 42.959622,
        longitude: -81.228499,
    });

    const [priceLimit, setPriceLimit] = useState("all");
    const [deliveryRequired, setDeliveryRequired] = useState("no");
    const [orderBy, setOrderBy] = useState("price");
    const [items, setItems] = useState([]);

    const locationFindMe = () => {
        //Locate person, update location
        //get GeoLocation from Browser
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                //get City/Province from server
                serverFetch('/location', {searchType: 'latlon', searchLat: lat, searchLon: lon})
                .then(response => {
                    //update Location
                    const newLocation = {
                        text: response.city + ", " + response.province,
                        latitude: lat,
                        longitude: lon,
                    }
                    setLocation(newLocation);
                    setCriteria('location', newLocation);
                })
                .catch(err => {
                    console.log(err);
                });
            });
        }
    }

    const checkLocation = (text) => {
        //get GeoLocation from text
        serverFetch('/location', {searchType: 'text', searchString: text})
            .then(response => {
                //update Location
                const newLocation = {
                    text: response.city + ", " + response.province,
                    latitude: response.latitude,
                    longitude: response.longitude,
                }
                setLocation(newLocation);
                setCriteria('location', newLocation);
            });
    }

    const typeLocation = (event) => {
        let text = event.target.value;
        if (timeText){
            clearTimeout(timeText);
        }
        setLocation({...location, text: text});
        setTimeText(setTimeout(() => {
            checkLocation(text);
          }, 1500));
    }

    const options = searchOptions.map((option, i) => {
        switch (option.name){
            case "Location":
                return (
                    <SearchOption 
                        key={i} 
                        location={location.text} 
                        findMe={locationFindMe} 
                        typeLocation={typeLocation} 
                        {...option} 
                    ></SearchOption>
                )
            case "PriceLimit":
                return (
                    <SearchOption 
                        key={i} 
                        onchange={setPriceLimit}
                        value={priceLimit}
                        {...option} 
                    ></SearchOption>
                )
            case "Delivery":
                return (
                    <SearchOption 
                        key={i} 
                        onchange={setDeliveryRequired}
                        value={deliveryRequired}
                        {...option} 
                    ></SearchOption>
                )
            case "OrderBy":
                return (
                    <SearchOption 
                        key={i} 
                        onchange={setOrderBy}
                        value={orderBy}
                        {...option} 
                    ></SearchOption>
                )
            case "Items":
                return (
                    <SearchOption 
                        key={i} 
                        items={items}
                        setItems={setItems}
                        {...option}
                    ></SearchOption>
                )
            default:
                return null;
        }
    })

    const searchHtml = props.searchDisplay ? (
        <React.Fragment>
            <table className={classes.FindOptions}><tbody>
                {options}
            </tbody></table>
            <div className={classes.FindBar}>
                <div></div>
                <div><button className={classes.FindButton} onClick={props.searchClick}>Search!</button></div>
            </div>
        </React.Fragment>
    ) : null;
    
    const setSearchCriteria = props.setSearchCriteria;
    const setCriteria = useCallback(() => {
        const searchCriteria = {
            location: location,
            priceLimit: priceLimit,
            deliveryRequired: deliveryRequired,
            orderBy: orderBy,
            items: items,
        }

        setSearchCriteria(searchCriteria);
    }, [setSearchCriteria, location, priceLimit, deliveryRequired, orderBy, items]);

    useEffect(() => {
        setCriteria();
    }, [setCriteria]);

    return (
        <div className={classes.SearchBox}>
            <div className={classes.FindBar}>
                <div>Find Your Deal:</div>
                <div><button className={classes.FindButton} onClick={props.searchClick}>Search!</button></div>
            </div>
            {searchHtml}
        </div>
    );
}
