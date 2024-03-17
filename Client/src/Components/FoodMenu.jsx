import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFoodItemsStart, fetchFoodItemsSuccess, fetchFoodItemsFailure } from '../Store/Slice/FoodItemSlice';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './Hooks/DarkModeContext';
import { useCartContext } from './Hooks/useCart';
import image1 from '../assets/image4.jpeg'
import image2 from '../assets/italain image2.jpg'
import image3 from '../assets/Pakistani+cuision.png'
import item1 from '../assets/item2.webp'
import item2 from '../assets/item4.jpg'
import item3 from '../assets/item5.webp'
import item4 from '../assets/item6.jpg'
import item5 from '../assets/item1.webp'
import Rating from 'react-rating';

function FoodMenu() {
    const dispatch = useDispatch();
    const foodItems = useSelector(state => state.foodItems.items);
    // const loading = useSelector(state => state.foodItems.loading);
    // const error = useSelector(state => state.foodItems.error);
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


    // Smooth scroll to selected category
    const handleCategoryClick = (category) => {
        const element = document.getElementById(category);
        element.scrollIntoView({ behavior: 'smooth' });
    };

    const showDetails = (foodItem) => {

        navigate(`/FoodItemDetails/${foodItem.FoodItemID}`, { state: { item: foodItem } });
    }

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }


    const images = [
        image1,
        image2,
        image3

    ];
    const items = [
        item1,
        item2,
        item3,
        item4,
        item5

    ];

    return (
        <div className={`card rounded-2 bg-${isDarkMode ? 'black' : 'light'}  food-items-container text-${isDarkMode ? 'light' : 'dark'} mt-md-5`}>
            {/* Categories section */}
            <div className={`container-fluid ms-2 mt-5 text-${isDarkMode ? 'light' : 'dark'} `}>
                <h1 className='fw-medium fs-1 '>Indian House Resturant</h1>
                <div className="d-flex flex-md-row flex-column  gap-3">
                    <span className=' fw-light fst-italic '>Free Deliveries</span>
                    <span className=' fw-light fst-italic '>$20- Minimum spent</span>
                    <span className=' fw-light fst-italic '>Service fee applies</span>
                </div>
            </div>
            <hr className='text-center bg-success ' />
            <h1 className={` fs-3 fw-light ms-3 mt-2 text-${isDarkMode ? 'light' : 'dark'} `}>Avaliable deals</h1>
            <div className={`container-fluid pt-4 d-flex  bg-${isDarkMode ? 'black' : 'light'} shadow-sm sticky-top `}>
                <div className="rounded-3 shadow-sm mt-5 w-100 px-2 pt-2">
                    <div className="row justify-content-start">
                        <div className="col">
                            <div className="d-flex flex-nowrap" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                                <p className={`text-${isDarkMode ? 'light' : 'dark'}  bg-${isDarkMode ? 'dark' : 'light'} fw-medium rounded-3 shadow-sm p-2 `}>Explore Menu</p>
                                {getUniqueCategories().map((category, index) => (
                                    <div key={index} className="mx-2">
                                        <button className={`btn fst-italic ceatogryBtnHover text-${isDarkMode ? 'light' : 'dark'}`} onClick={() => handleCategoryClick(category)}>
                                            {category} <small>({category.length})</small>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Food items section */}
            <div className="container mb-5">
                {getUniqueCategories().map((category, index) => (
                    <div key={index} id={category} className="category mt-5">
                        <h2 className={`fw-medium fs-3  mb-2 text-${isDarkMode ? 'light' : 'dark'} `}>{category}</h2>
                        <p className={`mb-3 fw-light fst-italic text-${isDarkMode ? 'light' : 'dark'}`}>The Original Al Mashoor wrap that put us on the map!</p>
                        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                            {foodItems.filter(item => item.Category === category).map((item, index) => (
                                <button onClick={() => { showDetails(item) }} key={index} className="col border-0 bg-transparent ">
                                    <div className={`card rounded-2 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                        <img className="card-img-top  rounded-top" src={items[index % images.length]} alt="Card image cap" />
                                        <div className="position-absolute d-flex justify-content-between w-100">
                                            <div className="bg-danger ms-2 p-1 pt-2 fs-6 fw-medium text-black bg-opacity-100 ">{item.FoodItemDiscount}%</div>
                                            <div className=" p-2 fs-5 fw-lighter bg-opacity-10 text-white"><i className="fa-solid fa-heart"></i></div>
                                        </div>
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div className='d-flex justify-content-between'>
                                                <h5 className={`card-title fs-6  fw-light text-${isDarkMode ? 'light' : 'dark'}`}>{item.Name}</h5>
                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                            </div>
                                            <div className="d-flex">
                                                <p className={`text-${isDarkMode ? 'light' : 'dark'} fw-lighter`} style={{ fontSize: "14px" }}>American Food, Fast Food</p>
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <h5 className={`card-title fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-light `}>${item.Price}</h5>
                                                <Rating
                                                    readonly
                                                    className='text-${isDarkMode? "success": "success" }'
                                                    initialRating="4"
                                                    emptySymbol={<i className="far fa-star"></i>}
                                                    fullSymbol={<i className="fas fa-star"></i>}
                                                />
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <h5 className={`card-title fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-light `}>30-40min</h5>
                                            </div>
                                        </div>
                                        <div className="card-footer" style={{ zIndex: 2 }}>
                                            <button className="btn btn-warning btn-sm btn-hover z-3" onClick={() => addToCart(item)}>
                                                Add to Bucket
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <footer className={` bg-${isDarkMode ? "dark" : "light"}  text-${isDarkMode ? "white" : "black"} py-5 mt-4`}>
                    <div className="container">
                        <h4 className='text-uppercase text-center mb-5 fw-bold' style={{ color: '#6c757d' }}>Indian Restaurant</h4>
                        <div className="row">
                            {/* Contact Information */}
                            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                                <h5 className="mb-4" style={{ color: '#6c757d' }}>Contact Info</h5>
                                <ul className="list-unstyled" style={{ color: '#6c757d' }}>
                                    <li className='mb-2 '>
                                        <i className="fas fa-phone-alt me-2 text-danger "></i>
                                        <a href="tel:+1234567890" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>(123) 456-7890</a>
                                    </li>
                                    <li className='mb-2 '>
                                        <i className="fas fa-envelope me-2 text-primary"></i>
                                        <a href="mailto:info@example.com" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>info@example.com</a>
                                    </li>
                                    <li className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic  mb-2   `}>
                                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                        123 Main Street, City
                                    </li>
                                </ul>
                            </div>
                            {/* About Us */}
                            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                                <h5 className="mb-4" style={{ color: '#6c757d' }}>About Us</h5>
                                <ul className="list-unstyled" style={{ color: '#6c757d' }}>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Intro</a></li>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Privacy Policy</a></li>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Mission</a></li>
                                </ul>
                            </div>
                            {/* Shops */}
                            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                                <h5 className="mb-4" style={{ color: '#6c757d' }}>Shops</h5>
                                <ul className="list-unstyled" style={{ color: '#6c757d' }}>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Lille France Jai Ho</a></li>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Indian Restaurant</a></li>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Namasta France</a></li>
                                    <li className='mb-2 '><a href="#" style={{ color: '#6c757d' }} className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Desi Meal France</a></li>
                                </ul>
                            </div>
                            {/* Restaurants */}
                            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                                <h5 className="mb-4" style={{ color: '#6c757d' }}>Products</h5>
                                <ul className="list-unstyled" style={{ color: '#6c757d' }}>
                                    <li className='mb-2 '><a href="#" className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Malai Boti</a></li>
                                    <li className='mb-2 '><a href="#" className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Tikka Boti</a></li>
                                    <li className='mb-2 '><a href="#" className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Sekah Kabab</a></li>
                                    <li className='mb-2 '><a href="#" className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Rogni Naan</a></li>
                                    <li className='mb-2 '><a href="#" className={` text-decoration-none  fw-light text-${isDarkMode ? "light" : "success"} fst-italic     `}>Mundi</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="row mt-4 justify-content-end">
                            <div className="col-auto">
                                <h5 className="mb-4" style={{ color: '#6c757d' }}>Follow Us</h5>
                                <ul className="list-unstyled d-flex flex-wrap gap-4">
                                    <li><a href="#"><i className="fab fa-facebook fa-lg text-primary"></i></a></li>
                                    <li><a href="#"><i className={`fab fa-twitter fa-lg text-${isDarkMode ? 'light' : 'dark'} `}></i></a></li>
                                    <li><a href="#"><i className="fab fa-instagram fa-lg text-danger"></i></a></li>
                                    <li><a href="#"><i className="fab fa-linkedin fa-lg text-primary"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-white p-3 bg-warning mt-4 position-absolute end-0 w-100 flex flex-column">
                        © {new Date().getFullYear()} Food Website. All rights reserved. | Terms & Conditions | Cookies Privacy
                        <p><small>Professional Website Developed by Lofty Logistics Inc.</small></p>
                    </div>
                </footer>

        </div>
    );
}

export default FoodMenu;
