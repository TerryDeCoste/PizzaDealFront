import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// describe('Search Criteria Change', () => {
    // price limit
    // delivery required
    // order by
// });
// 
// describe('Item Criteria', () => {
    // Add items - proper size, count, options, option counts
    // update existing count if re-added
    // update count via drop-down
    // if count = 0, remove
    // remove via X
// });
