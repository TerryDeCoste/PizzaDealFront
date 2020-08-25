import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import App from '../App';

jest.mock('../util/serverfetch');

describe('On Open', () => {
    test('Shows the Proper Initial Data', async () => {
        await act(async () => { await render(<App />); });

        //header
        expect(screen.getByText(/Find My Pizza Deal!/i)).toBeInTheDocument();

        //find your deal
        expect(screen.getByText(/Find Your Deal:/i)).toBeInTheDocument();

        //disclaimer
        expect(screen.getByText(/All data is provided on an as-is basis/i)).toBeInTheDocument();

        //top deals
        expect(await screen.findByText(/Top Deals In Your Area/i)).toBeInTheDocument();

        //providers
        expect(await screen.findByText(/With Deals from:/i)).toBeInTheDocument();
    });
});

import SearchOptions from '../components/SearchOption/SearchOption';
const mockFindMe = jest.fn();
const mockTypeLocation = jest.fn();

describe('Location module', () => {
    beforeEach(() => {
        return render(
        <table><tbody>
            <SearchOptions 
                type="Location"
                findMe={mockFindMe}
                typeLocation={mockTypeLocation}
                location='Default Text'
            />
        </tbody></table>);//render just the Location section with mocked functions
    });

    test('Find Me Button triggers properly', async () => {
        userEvent.click(screen.getByRole('button', { name: /find me/i }));
        expect(mockFindMe).toHaveBeenCalledTimes(1);
    });
    test('Finds the location when typing', async () => {
        userEvent.type(screen.getByRole('textbox'), 'Toronto, ON');
        expect(mockTypeLocation).toHaveBeenCalledTimes(11);
    });
});

describe('Search', () => {
    test('Displays deals with the default criteria', async () => {
        await act(async () => { await render(<App />); });

        //default criteria
        const searchButton = await screen.findAllByText(/Find It!/i);
        await act(async () => { await userEvent.click(searchButton[0]); });

        expect(await screen.findByText(/CAULI FRESCA/i)).toBeInTheDocument();
    });
    test('Displays no deals with adjusted criteria', async () => {
        await act(async () => { await render(<App />); });

        //change criteria
        const priceLimit = screen.getByText(/Price Limit/i).parentElement.children[1].children[0];
        priceLimit.value = 5;
        fireEvent.change(priceLimit);

        //click button
        const searchButton = await screen.findAllByText(/Find It!/i);
        await act(async () => { await userEvent.click(searchButton[0]); });

        expect(await screen.findByText(/No deals found, please check your criteria./i)).toBeInTheDocument();
    });
});

import SearchBox from '../containers/SearchBox/SearchBox';
const mockSearchClick = jest.fn();
const mockSetSearchCriteria = jest.fn();

describe('Search Criteria Change', () => {
    beforeEach(async() => {
        mockSearchClick.mockClear();
        mockSetSearchCriteria.mockClear();
        
        return await act(async() => {
            return await render(
                <SearchBox 
                    searchDisplay={true}
                    searchClick={mockSearchClick}
                    setSearchCriteria={mockSetSearchCriteria}
                />);//render just the Search section with mocked functions
            }
        );
    });
    test('Price Limit Change and trigger', async () => {
        const priceLimit = screen.getByText(/Price Limit/i).parentElement.children[1].children[0];
        priceLimit.value = 5;
        fireEvent.change(priceLimit);

        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2); //one to set, one to update
        expect(mockSetSearchCriteria.mock.calls[1][0].priceLimit).toBe('5');

        userEvent.click(screen.getAllByRole('button', { name: /find it/i })[0]);
        expect(mockSearchClick).toHaveBeenCalledTimes(1);
    });
    test('Delivery Required Change and trigger', async () => {
        const delRequired = screen.getByText(/Delivery Required/i).parentElement.children[1].children[0];
        delRequired.value = 'yes';
        fireEvent.change(delRequired);

        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2); //one to set, one to update
        expect(mockSetSearchCriteria.mock.calls[1][0].deliveryRequired).toBe('yes');

        userEvent.click(screen.getAllByRole('button', { name: /find it/i })[0]);
        expect(mockSearchClick).toHaveBeenCalledTimes(1);
    });
    test('Order By Change and trigger', async () => {
        const orderBy = screen.getByText(/Order By/i).parentElement.children[1].children[0];
        orderBy.value = 'price';
        fireEvent.change(orderBy);

        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2); //one to set, one to update
        expect(mockSetSearchCriteria.mock.calls[1][0].orderBy).toBe('price');

        userEvent.click(screen.getAllByRole('button', { name: /find it/i })[0]);
        expect(mockSearchClick).toHaveBeenCalledTimes(1);
    });
    test('Items: Add - proper size, count, options, option counts', async () => {
        //add with default
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        const defaultItem = screen.getByRole('button', { name: /x/i }).parentElement;
        
        //check initial display item
        expect(defaultItem).toHaveTextContent(/X-Large/i);
        expect(defaultItem).toHaveTextContent(/Pizza/i);
        expect(defaultItem).toHaveTextContent(/topping/i);
        
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //verify search criteria has correct item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2);
        const firstItem = mockSetSearchCriteria.mock.calls[1][0].items[0];
        expect(firstItem.name).toBe('Pizza');
        expect(firstItem.size).toBe('X-Large');
        expect(firstItem.options).toBe('topping');
        expect(firstItem.count).toBe(1);
        expect(firstItem.optionCount).toBe(0);


        //change options, add
        screen.getByLabelText(/Item:/i).value = 4;
        fireEvent.change(screen.getByLabelText(/Item:/i));
        screen.getByLabelText(/Size:/i).value = 3;
        fireEvent.change(screen.getByLabelText(/Size:/i));
        screen.getAllByLabelText(/Count:/i)[0].value = 2;
        fireEvent.change(screen.getAllByLabelText(/Count:/i)[0]);
        screen.getByLabelText(/Options:/i).value = 'premium_topping';
        fireEvent.change(screen.getByLabelText(/Options:/i));
        screen.getByLabelText(/OptionCount:/i).value = 3;
        fireEvent.change(screen.getByLabelText(/OptionCount:/i));
        
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //check second item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(3);
        const secondItem = mockSetSearchCriteria.mock.calls[2][0].items[1];
        expect(secondItem.name).toBe('Panzerotti');
        expect(secondItem.size).toBe('7-inch');
        expect(secondItem.options).toBe('topping');
        expect(secondItem.count).toBe(2);
        expect(secondItem.optionCount).toBe(3);
        
    });
    test('Items: update existing count if re-added', async () => {
        //add with default
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        const defaultItem = screen.getByRole('button', { name: /x/i }).parentElement;
        
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //verify search criteria has correct item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2);
        const firstItem = mockSetSearchCriteria.mock.calls[1][0].items[0];
        expect(firstItem.count).toBe(1);
        
        // add item again
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //check second item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(3);
        const secondItem = mockSetSearchCriteria.mock.calls[2][0].items[0];
        expect(secondItem.count).toBe(2);
    });
    test('Items: update count via drop-down', async () => {
        //add with default
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        const defaultItem = screen.getByRole('button', { name: /x/i }).parentElement;
        
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //verify search criteria has correct item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2);
        const firstItem = mockSetSearchCriteria.mock.calls[1][0].items[0];
        expect(firstItem.count).toBe(1);
        
        // update count
        const itemCount = screen.getByRole('button', { name: /x/i }).parentElement.children[0];
        itemCount.value = 3;
        fireEvent.change(itemCount);
        
        //check item count
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(3);
        const secondItem = mockSetSearchCriteria.mock.calls[2][0].items[0];
        expect(secondItem.count).toBe(3);
    });
    test('Items: Remove item if count is changed to 0', async () => {
        //add with default
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        const defaultItem = screen.getByRole('button', { name: /x/i }).parentElement;
        
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //verify search criteria has correct item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2);
        const firstItem = mockSetSearchCriteria.mock.calls[1][0].items[0];
        expect(firstItem.count).toBe(1);
        
        // update count
        const itemCount = screen.getByRole('button', { name: /x/i }).parentElement.children[0];
        itemCount.value = 0;
        fireEvent.change(itemCount);
        
        //check item count
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(3);
        const secondItem = mockSetSearchCriteria.mock.calls[2][0].items;
        expect(secondItem).toEqual([]);
    });
    test('Items: Remove item if "x" is clicked', async () => {
        //add with default
        userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
        const defaultItem = screen.getByRole('button', { name: /x/i }).parentElement;
        
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //verify search criteria has correct item
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(2);
        const firstItem = mockSetSearchCriteria.mock.calls[1][0].items[0];
        expect(firstItem.count).toBe(1);
        
        // remove via x
        userEvent.click(screen.getByRole('button', { name: /x/i }));
        //fire change event to make sure update shown properly
        fireEvent.change(screen.getByText(/Order By/i).parentElement.children[1].children[0]);

        //check item count
        expect(mockSetSearchCriteria).toHaveBeenCalledTimes(3);
        const secondItem = mockSetSearchCriteria.mock.calls[2][0].items;
        expect(secondItem).toEqual([]);
    });
});