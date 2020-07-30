import React, {useState, useEffect} from 'react';
import classes from './ItemSearch.module.css';

import serverFetch from '../../../util/serverfetch';

const itemBox = (item, addUpdateItem, key) => {
    const deleteItem = (item) => {
        item.count = 0;
        addUpdateItem(item);
    }
    const changeCount = (item, event) => {
        item.count = Number(event.target.value);
        addUpdateItem(item);
    }
    const changeOptionCount = (item, event) => {
        item.optionCount = Number(event.target.value);
        addUpdateItem(item);
    }
    const countDD = [0,1,2,3,4,5,6,7,8,9,10].map(count => {
        return (<option key={count} value={count}>{count}</option>)
    })
    return (
        <div className={classes.ItemBox} key={key}>
            <select className={classes.ItemCount} value={item.count} onChange={(event) => {changeCount(item, event)}}>{countDD}</select>
            <div className={classes.ItemSize}>{item.size}</div>
            <div className={classes.ItemName}>{item.name}</div>
            <div className={classes.ItemOptions}>with</div>
            <select className={classes.ItemCount} value={item.optionCount} onChange={(event) => {changeOptionCount(item, event)}}>{countDD}</select>
            <div className={classes.ItemOptions}>{item.options}(s)</div>
            
            <button className={classes.ItemRemoveButton} onClick={() => {deleteItem(item)}}>x</button>
        </div>
    )
}

const itemSelector = (id, label, onchange, itemList, value) => (
    <div className={classes.ItemSelectors} >
        <label htmlFor={id} className={classes.ItemSelectLabels}>
            {label}: 
        </label>
        <select id={id} value={value} onChange={onchange}>
            {itemList}
        </select>
    </div>
)

export default (props) => {
    const [itemOptions, setItemOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);
    const [sizes, setSizes] = useState([]);
    const [size, setSize] = useState(0);
    const [sOptions, setSOptions] = useState([]);
    const [option, setOption] = useState(0);
    const [count, setCount] = useState(1);
    const [optionCount, setOptionCount] = useState(0);

    useEffect(() => {
        //get Item Options from server, update state
        serverFetch('/itemoptions')
        .then(response => {
            setItemOptions(response.items);
            setSelectedItem(response.items[0].id);
            setSizes(response.items[0].sizes);
            setSize(response.items[0].sizes[0].id);
            setSOptions(response.items[0].options);
            setOption(response.items[0].options[0].option);
            setCount(1);
            setOptionCount(0);
        });
    }, []);

    const onChangeItem = (event) => {
        const itemToSelect = itemOptions.find(item => item.id === Number(event.target.value));
        if (itemToSelect){
            setSelectedItem(itemToSelect.id);
            setSizes(itemToSelect.sizes);
            setSize(itemToSelect.sizes[0].id);
            setSOptions(itemToSelect.options);
            setOption(itemToSelect.options[0].option);
            setCount(1);
            setOptionCount(0);
        }
    }

    const addNewItem = () => {
        const itemToAdd =  itemOptions.find(item => item.id === selectedItem);
        
        const idCalc = 'id' + selectedItem + 'sz' + size + 'opt' + option;

        //check if already exists
        const existingItem = props.items.find((item) => item.calcID === idCalc);
        if (existingItem){
            const newItems = props.items.map((item) => {
                if (item.calcID === idCalc){
                    item.count += count;
                    item.optionCount += optionCount;
                } 
                return item;
            });

            props.setItems(newItems);
        } else {
            //create the item
            const newItem = {
                calcID: idCalc,
                id: itemToAdd.id,
                name: itemToAdd.name,
                size: itemToAdd.sizes.find(sz => sz.id === size).display,
                sizeId: size,
                options: option,
                count: count,
                optionCount: optionCount,
            }
            //add
            const newItemList = [...props.items];
            newItemList.push(newItem);
            props.setItems(newItemList);
        }
    }

    const addUpdateItem = (updateItem) => {
        const upDatedItems = props.items.map(item => {
            if (item.calcID === updateItem.calcID){
                item = {...item, ...updateItem}
            }
            return item;
        });
        //filter out 0 count items
        const newUpdateItems = upDatedItems.filter((item) => item.count > 0);

        props.setItems(newUpdateItems);
    }

    if (itemOptions.length === 0){
        return null;
    }

    //Item dropdown
    const itemDD = itemOptions.map((item, i) => (
        <option key={i} value={item.id}>{item.name}</option>
    ))
    //Size dropdown
    const sizeDD = sizes.map((size, i) => (
        <option key={i} value={size.id}>{size.display}</option>
    ))
    //options dropdown
    const optionsDD = sOptions.map((option, i) => (
        <option key={i} value={option.option}>{option.display}</option>
    ))
    //count box - dropdown: default 1, max 10
    const countDD = [1,2,3,4,5,6,7,8,9,10].map((count, i) => (
        <option key={i} value={count}>{count}</option>
    ))
    //option count box - dropdown: default 0, max 10
    const optionCountDD = [0,1,2,3,4,5,6,7,8,9,10].map((count, i) => (
        <option key={i} value={count}>{count}</option>
    ))
    //Already added items list - with option to change count, and button to remove - possible re-factor to sub-component
    const itemsList = props.items.map((item, i) => itemBox(item, addUpdateItem, i));
    
    return (
        <div>
            {itemSelector("item_select", "Item", onChangeItem, itemDD, selectedItem)}
            {itemSelector("size_select", "Size", (event) => setSize(Number(event.target.value)), sizeDD, size)}
            {itemSelector("count_select", "Count", (event) => setCount(Number(event.target.value)), countDD, count)}
            {itemSelector("option_select", "Options", (event) => setOption(event.target.value), optionsDD, option)}
            {itemSelector("option_count_select", "OptionCount", (event) => setOptionCount(Number(event.target.value)), optionCountDD, optionCount)}

            <div>
                <button id="btn_add_item" className={classes.FindMeButton} onClick={addNewItem}>Add Item</button>
            </div>
            <div className={classes.ItemList}>
                {itemsList}
            </div>
        </div>
    )
}