import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import itempng from '../assets/hamburger-ingredients_98292-3567-removebg-preview.png'
import { useCartContext } from './Hooks/useCart';
import { useDarkMode } from './Hooks/DarkModeContext';

const FoodItemDetails = () => {
    const { id } = useParams();

    const  {isDarkMode } = useDarkMode()

    const {addToCart } = useCartContext();
    const [item, setItem] = useState(null);
    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch(`http://localhost:4000/api/getFoodItems/${id}`, {
                    headers: {
                        Authorization: `${token}`, // Use Bearer token format
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch food item');
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    setItem(data[0]);
                } else {
                    throw new Error('Food item not found');
                }
            } catch (error) {
                console.error('Error fetching food item:', error);
            }
        };

        fetchFoodItem();
    }, [id]);

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex align-items-center justify-content-center">
    <div className={`container mt-5 pt-5 bg-${isDarkMode ? 'dark' : 'white'}  text-${isDarkMode ? 'light' : 'dark'}`}>
        <div className="row">
            <div className="col-md-6">
                <img src={itempng} alt={item.Name} className="img-fluid" />
            </div>
            <div className="col-md-6">
                <h2>{item.Name}</h2>
                <p>Price: ${item.Price}</p>
                <div className="mb-3">
                    <label htmlFor="size">Size:</label>
                    <select className="form-select">
                        {item.sizes && item.sizes.map((size, index) => (
                            <option key={index} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3" style={{ maxWidth: '200px', maxHeight: '200px', overflowY: 'scroll' }}>
                    <label htmlFor="toppings">Toppings:</label>
                    <div>
                        {item.toppings && item.toppings.map((topping, index) => (
                            <div key={index} className="form-check">
                                <input className="form-check-input" type="checkbox" value={topping} id={`topping-${index}`} />
                                <label className="form-check-label" htmlFor={`topping-${index}`}>{topping}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3" style={{ maxWidth: '200px', maxHeight: '200px', overflowY: 'scroll' }}>
                    <label htmlFor="drinks">Drinks:</label>
                    <div>
                        {item.drinks && item.drinks.map((drink, index) => (
                            <div key={index} className="form-check">
                                <input className="form-check-input" type="checkbox" value={drink} id={`drink-${index}`} />
                                <label className="form-check-label" htmlFor={`drink-${index}`}>{drink}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => { addToCart(item) }}>Add to Cart</button>
            </div>
        </div>
    </div>
</div>

    );
};

export default FoodItemDetails;
