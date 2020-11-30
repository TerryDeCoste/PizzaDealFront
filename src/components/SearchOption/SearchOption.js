import React from 'react';
import classes from './SearchOption.module.css';
import ItemSearch from './ItemSearch/ItemSearch';

const number = (name, onchange, value) => (
    <input type="number" name={name} min="0" value={value} onChange={(event) => {onchange(event.target.value)}}></input>
)

const dropdown = (name, options, onchange, value) => {
    const optionHtml = options.map(option => (
        <option key={option.key} value={option.key}>{option.display}</option>
    ));

    return (
        <select name={name} defaultValue={value} onChange={(event) => {onchange(event.target.value)}}>
            {optionHtml}
        </select>);
}

const location = (findMe, typeLocation, location) => {
    return (<div className={classes.LocationBox}>
        <div className={classes.LocationColumns}>
            <button id="btn_find_me" className={classes.FindMeButton} onClick={findMe}>Use My Current Location</button>
            <input type="text" id="location_input" className={classes.InputField} onChange={typeLocation} value={location}></input>
        </div>
    </div>);
}

const items = (props) => (
    <ItemSearch {...props}></ItemSearch>
)

export default (props) => {
    let html = null;    
    switch (props.type){
        case "number":
            html = number(props.name, props.onchange, props.value);
            break;
        case "Dropdown":
            html = dropdown(props.name, props.options, props.onchange, props.value);
            break;
        case "Location":
            html = location(props.findMe, props.typeLocation, props.location);
            break;
        case "Items":
            html = items(props);
            break;
        default:
            break;
    }

    return (
        <tr>
            <td>{props.display}</td><td>{html}</td>
        </tr>
    )
}