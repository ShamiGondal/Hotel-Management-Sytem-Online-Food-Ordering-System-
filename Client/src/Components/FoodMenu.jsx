import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFoodItemsStart, fetchFoodItemsSuccess, fetchFoodItemsFailure } from '../Store/Slice/FoodItemSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cart from './Cart';
import foodCeatogry from '../assets/hamburger-ingredients_98292-3567-removebg-preview.png'
import { useCartContext } from './Hooks/useCart';


function FoodMenu() {
    const dispatch = useDispatch();
    const foodItems = useSelector(state => state.foodItems.items);
    const loading = useSelector(state => state.foodItems.loading);
    const error = useSelector(state => state.foodItems.error);
    const { isDarkMode } = useDarkMode();
    const { addToCart } = useCartContext();
    const navigate = useNavigate();

    // Fetch food items on component mount
    useEffect(() => {
        dispatch(fetchFoodItemsStart());
        fetch('http://localhost:4000/api/getFoodItems')
            .then(response => response.json())
            .then(data => dispatch(fetchFoodItemsSuccess(data)))
            .catch(error => dispatch(fetchFoodItemsFailure(error.message)));
    }, [dispatch]);

    // Function to get unique categories from food items
    const getUniqueCategories = () => {
        const uniqueCategories = [];
        foodItems.forEach(item => {
            if (!uniqueCategories.includes(item.Category)) {
                uniqueCategories.push(item.Category);
            }
        });
        return uniqueCategories;
    };

    const [selectedCategory, setSelectedCategory] = useState(null);

    // Smooth scroll to selected category
    const handleCategoryClick = (category) => {
        const element = document.getElementById(category);
        element.scrollIntoView({ behavior: 'smooth' });
    };

    const showDetails=(foodItem)=>{

        navigate(`/FoodItemDetails/${foodItem.FoodItemID}`, { state: { item: foodItem } });
    }

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }
    return (
        <div className={`card rounded-2 bg-${isDarkMode ? 'black' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} mt-5`}>
            {/* Categories section */}
            <div className="container py-5">
                <h1 className="text-center mb-5">Explore Menu</h1>
                <div className="row justify-content-center">
                    {getUniqueCategories().map((category, index) => (
                        <div key={index} className="col-auto">
                            <button className="btn btn-outline-danger mx-2" onClick={() => handleCategoryClick(category)}>
                                {category}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            

            {/* Food items section */}
            <div className="container mb-5">
                {getUniqueCategories().map((category, index) => (
                    <div key={index} id={category} className="category mt-5">
                        <h2 className=" mb-3">{category}</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {foodItems.filter(item => item.Category === category).map((item, index) => (
                                <button  onClick={()=>{showDetails(item)}}  key={index} className="col border-0 bg-transparent ">
                                <div className={`card rounded-2 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                <div className="position-absolute top-0 start-50 translate-middle p-2 mt-3 bg-danger border border-light rounded-circle" style={{ transform: 'translateX(-20%)' }}>
                                        <span className="fs-6 text-white fw-bold">{item.FoodItemDiscount}% off</span>
                                    </div>
                                        <img src={foodCeatogry} className="card-img-top" alt={item.Name} />
                                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                            <h5 className="card-title">{item.Name}</h5>
                                            <p className="card-text fw-bold text-white">Rs: {item.Price}</p>
                                            <button className="btn btn-danger text-center btn-sm btn-hover" onClick={() => addToCart(item)}>Add to Cart</button>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart component */}
           
        </div>
    );
}

export default FoodMenu;
