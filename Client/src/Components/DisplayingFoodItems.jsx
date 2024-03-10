import { useEffect, useState } from 'react';
import RobotPng from '../assets/bannerimage.png'
import foodCeatogry from '../assets/hamburger-ingredients_98292-3567-removebg-preview.png'
import { useSelector, useDispatch } from 'react-redux';
import { fetchFoodItemsStart, fetchFoodItemsSuccess, fetchFoodItemsFailure } from '../Store/Slice/FoodItemSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cart from './Cart';
import FoodLoader from './FoodLoader';
import { useCartContext } from './Hooks/useCart';


function DisplayingFoodItems() {
    const dispatch = useDispatch();
    const foodItems = useSelector(state => state.foodItems.items);
    const loading = useSelector(state => state.foodItems.loading);
    const error = useSelector(state => state.foodItems.error);
    const [isLoading, setIsLoading] = useState(true);
    const { isDarkMode } = useDarkMode();
    const { addToCart } = useCartContext();




    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchFoodItemsStart());
        fetch('http://localhost:4000/api/getFoodItems')
            .then(response => response.json())
            .then(data => dispatch(fetchFoodItemsSuccess(data)))
            .catch(error => dispatch(fetchFoodItemsFailure(error.message)));
        setIsLoading(false)
    }, [dispatch]);

    const getUniqueCategories = () => {
        const uniqueCategories = [];
        foodItems.forEach(item => {
            if (!uniqueCategories.includes(item.Category)) {
                uniqueCategories.push(item.Category);
            }
        });
        return uniqueCategories;
    };

    const categories = getUniqueCategories();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === categories.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? categories.length - 1 : prevIndex - 1));
    };

    const [orderItems, setOrderItems] = useState([]);

    // Function to add item to cart
    const handleAddToCart = (foodItem) => {
        console.log('Adding to cart:', foodItem);
        addToCart(foodItem);
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
        <>

            <div className={`food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <div id="carouselExampleCaptions" className="carousel slide">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className={`carousel-inner `}>
                        <div className={`"carousel-item active `}>
                            <img src={RobotPng} className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>First slide label</h5>
                                <p>Some representative placeholder content for the first slide.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={RobotPng} className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Second slide label</h5>
                                <p>Some representative placeholder content for the second slide.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={RobotPng} className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Third slide label</h5>
                                <p>Some representative placeholder content for the third slide.</p>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span> */}
                        <i className="fa-solid fa-circle-chevron-left text-danger fs-3 "></i>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        {/* <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span> */}
                        <i className="fa-solid fa-circle-chevron-right text-danger fs-3 "></i>
                    </button>
                </div>
                {isLoading ? (
                    <FoodLoader />
                ) : (
                    <>
                        <div className="container category-carousel">
                            <h3 className='mt-3 ms-3'>Explore Menu</h3>
                            <div className="navigation_left d-none d-md-block">
                                <button className="btn btn-light bg-transparent border-0 " onClick={handlePrevious}><i className="fa-solid fa-circle-chevron-left text-danger fs-3"></i></button>
                            </div>
                            <div className="categories">
                                {categories.map((category, index) => (
                                    <div key={index} className={`category-item-wrapper  `}>
                                        <button
                                            id='categoryCard'
                                            onClick={() => navigate('/FoodMenu')}
                                            className={`category-item ${index === currentIndex ? 'active' : ''} bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}
                                        >
                                            <img src={foodCeatogry} className="d-block w-100 rounded-circle" alt="..." />
                                        </button>
                                        <div className="text-center">
                                            <h5>{category}</h5>
                                            <hr className='bg-danger w-25 bg-danger ' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="navigation_right d-none d-md-block">
                                <button className="btn btn-light bg-transparent border-0 " onClick={handleNext}><i className="fa-solid fa-circle-chevron-right text-danger fs-3 "></i></button>
                            </div>
                        </div>
                        <div className="container">
                            <h3 className="mt-3 ms-3 mb-5 fw-medium fst-italic">Top Sellings</h3>
                            <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                                {foodItems.map(foodItem => (
                                    <button className="border-0 bg-transparent" onClick={() => showDetails(foodItem)} key={foodItem.FoodItemID} style={{ position: 'relative' }}>
                                        <div className={`card rounded-2 bg-${isDarkMode ? 'dark' : 'light'} bg-opacity-50 food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                            <img className="card-img-top rounded-top" src={foodCeatogry} alt="Card image cap" />
                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <div>
                                                    <h5 className="card-title fs-6">{foodItem.Name}</h5>
                                                    <p className={`card-text fw-bold `}>Rs {foodItem.Price}</p>
                                                </div>
                                                <button className="btn btn-danger btn-sm btn-hover" onClick={() => handleAddToCart(foodItem)}>
                                                    Add to Bucket
                                                </button>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </>
                )}

                <footer className="bg-dark text-white py-5 mt-4">
                    <div className="container">
                        <h4 className='text-capitalize text-center mb-5 '>Indian Resturnat</h4>
                        <div className="row">
                            {/* Contact Information */}
                            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 gap-1 ">
                                <h5 className="mb-4">Contact Information</h5>
                                <ul className="list-unstyled">
                                    <li>
                                        <i className="fas fa-phone-alt me-2"></i>
                                        <a href="tel:+1234567890">(123) 456-7890</a>
                                    </li>
                                    <li>
                                        <i className="fas fa-envelope me-2"></i>
                                        <a href="mailto:info@example.com">info@example.com</a>
                                    </li>
                                    <li>
                                        <i className="fas fa-map-marker-alt me-2"></i>
                                        123 Main Street, City
                                    </li>
                                </ul>
                            </div>
                            {/* About Us */}
                            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                                <h5 className="mb-4">About Us</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla commodo neque vel sapien malesuada, at ultricies nulla hendrerit.</p>
                            </div>
                            {/* Restaurant List */}
                            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                                <h5 className="mb-4">Restaurants</h5>
                                <ul className="list-unstyled">
                                    <li><a href="#">Restaurant 1</a></li>
                                    <li><a href="#">Restaurant 2</a></li>
                                    <li><a href="#">Restaurant 3</a></li>
                                    {/* Add more restaurants as needed */}
                                </ul>
                            </div>
                        </div>
                        {/* Subscribe Section */}
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <h5 className="mb-4">Subscribe to Our Newsletter</h5>
                                <div className="input-group">
                                    <input type="email" className="form-control" placeholder="Enter your email" aria-label="Enter your email" />
                                    <button className="btn btn-primary" type="button">Subscribe</button>
                                </div>
                            </div>
                        </div>
                        {/* Social Media Icons */}
                        <div className="row mt-4">
                            <div className="col">
                                <h5 className="mb-4">Follow Us</h5>
                                <ul className="list-unstyled d-flex flex-wrap gap-2">
                                    <li><a href="#"><i className="fab fa-facebook fa-lg"></i></a></li>
                                    <li><a href="#"><i className="fab fa-twitter fa-lg"></i></a></li>
                                    <li><a href="#"><i className="fab fa-instagram fa-lg"></i></a></li>
                                    <li><a href="#"><i className="fab fa-linkedin fa-lg"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Copyright */}
                    <div className="text-center p-3 bg-secondary mt-4">
                        © {new Date().getFullYear()} Food Website. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}

export default DisplayingFoodItems;
