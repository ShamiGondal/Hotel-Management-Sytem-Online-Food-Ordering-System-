import { useEffect, useState } from 'react';
import image1 from '../assets/image4.jpeg'
import image2 from '../assets/italain image2.jpg'
import image3 from '../assets/Pakistani+cuision.png'
import asside1 from '../assets/aside1.jpg'
import asside2 from '../assets/aside2.jpg'
import item1 from '../assets/item2.webp'
import item2 from '../assets/item4.jpg'
import item3 from '../assets/item5.webp'
import item4 from '../assets/item6.jpg'
import item5 from '../assets/item1.webp'
import Rating from 'react-rating';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFoodItemsStart, fetchFoodItemsSuccess, fetchFoodItemsFailure } from '../Store/Slice/FoodItemSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cart from './Cart';
import FoodLoader from './FoodLoader';
import { useCartContext } from './Hooks/useCart';
import Cookies from 'js-cookie';




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
        <>

            <div className={`food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                    <div className="carousel-inner">
                        <div className="carousel-item active text-center">
                            <img src={image1} className="d-block w-100" alt="Slide 1" />
                            <div className="carousel-caption d-none d-md-block position-absolute top-50 start-50 translate-middle ">
                                <h1 className='animate__animated animate__backInLeft fs-1 fw-bolder'>Pakistani Kahnoo ki kia baat ha!</h1>
                                <p className='animate__animated animate__backInLeft'>Try out our new Pakistani Dishes.</p>
                                <p className='animate__animated animate__backInLeft'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed rerum iusto magni?</p>
                            </div>
                        </div>
                        <div className="carousel-item text-center">
                            <img src={image2} className="d-block w-100" alt="Slide 2" />
                            <div className="carousel-caption d-none  position-absolute top-50 start-50 translate-middle ">
                                <h1 className='animate__animated animate__backInRight fs-1 fw-bolder'>Italian Cusine is on of most popular Dishes!</h1>
                                <p className='animate__animated animate__backInRight'>Try out our new Italian Dishes.</p>
                                <p className='animate__animated animate__backInRight'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed rerum iusto magni?</p>
                            </div>
                        </div>
                        <div className="carousel-item text-center">
                            <img src={image3} className="d-block w-100" alt="Slide 3" />
                            <div className="carousel-caption d-none d-md-block position-absolute top-50 start-50 translate-middle ">
                                <h1 className='animate__animated animate__backInUp fs-1 fw-bolder'>Desi Khano Sa Bar k kuch Nhi!</h1>
                                <p className='animate__animated animate__backInUp '>Try out our new Desi Dishes.</p>
                                <p className='animate__animated animate__backInUp '>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed rerum iusto magni?</p>
                            </div>
                        </div>
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>


                {isLoading ? (
                    <FoodLoader />
                ) : (
                    <>
                        <div className="d-md-flex justify-content-between container mt-5  ">
                            <h4 className='mt-3 fw-medium  '>Browse by Cetogries </h4>
                            <button className='mt-3  text-danger  bg-transparent border-0  border fw-medium '>see all Cetogries </button>
                        </div>
                        <div className="container category-carousel">
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
                                            <img src={images[index % images.length]} className="d-block rounded-circle" alt="..." style={{ width: '140px', height: '130px' }} />
                                        </button>
                                        <div className="text-center">
                                            <h5 className='fs-6 fw-light text-body-emphasis '>{category}</h5>

                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="navigation_right d-none d-md-block">
                                <button className="btn btn-light bg-transparent border-0 " onClick={handleNext}><i className="fa-solid fa-circle-chevron-right text-danger fs-3 "></i></button>
                            </div>
                        </div>
                        <div className="container mt-5 mb-3">
                            <div className=" d-md-flex justify-content-between align-items-center">
                                <h4 className='fw-medium'>Your Previous Orders</h4>
                                <button className='text-danger bg-transparent border-0 border fw-medium'>See All Past Orders</button>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-3">
                                <div className="col mb-3">
                                    <div className="card" style={{ width: "17rem" }}>
                                        <img className="card-img-top " src={image1} alt="Card image cap" />
                                        <div className="card-body">
                                            <h5 className="card-title">Chilli Check Pizza</h5>
                                            <p className="card-text">Italian Crust , 2-Drinks</p>
                                            <a href="#" className="btn btn-primary btn-sm">Re-Order</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card " style={{ width: "17rem" }}>
                                        <img className="card-img-top" src={image2} alt="Card image cap" />
                                        <div className="card-body">
                                            <h5 className="card-title">Kabab Chicken Pizza</h5>
                                            <p className="card-text">Italian Crust , 2-Drinks</p>
                                            <a href="#" className="btn btn-primary btn-sm">Re-Order</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card" style={{ width: "17rem" }}>
                                        <img className="card-img-top" src={image3} alt="Card image cap" />
                                        <div className="card-body">
                                            <h5 className="card-title">Papporni Chicken Pizza</h5>
                                            <p className="card-text">Italian Crust , 2-Drinks</p>
                                            <a href="#" className="btn btn-primary btn-sm">Re-Order</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-5">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className='fw-medium mb-3'>Exploure our Collections</h4>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row row-cols-1 row-cols-md-2 g-4">
                                <div className="col">
                                    <div className="position-relative">
                                        <img src={image1} className="w-100" style={{ height: "20rem" }} alt="Image 1" />
                                        <button className="btn btn-light bg-opacity-25  position-absolute bottom-0 start-0 m-3">Explore More</button>
                                    </div>
                                </div>
                                <div className="col position-relative">
                                    <img src={image2} className="w-100" style={{ height: "20rem" }} alt="Image 2" />
                                    <button className="btn btn-light bg-opacity-25 position-absolute bottom-0 start-0 m-3">Top rated</button>
                                </div>

                            </div>
                            <div className="row mt-5">
                                <div className="col-12 col-md-3 d-none d-md-block position-relative">
                                    <div className="position-absolute top-0 start-50 translate-middle-x w-50" style={{ zIndex: 1, marginTop: "30px", marginLeft: "-40px" }}>
                                        <div className="bg-light bg-opacity-25 p-3">
                                            <h5 className="text-white fw-bold fs-3">Most Popular Near You</h5>
                                        </div>
                                    </div>
                                    <div className="image-container" style={{ height: window.innerWidth < 1200 ? "70rem" : "45rem" }}>
                                        <img src={asside1} alt="Image of girl eating pizza" className="img-fluid" style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                                    </div>




                                    <div className="position-absolute bottom-0 start-50 translate-middle-x text-center w-100" style={{ zIndex: 1, marginBottom: "60px" }}>
                                        <button className="btn btn-light w-75">See All</button>
                                    </div>
                                </div>

                                <div className="col-12 col-md-9">
                                    <div className="container">
                                        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                                            {foodItems.slice(0, 6).map((foodItem, index) => (
                                                <button
                                                    className="border-0 bg-transparent"
                                                    onClick={() => showDetails(foodItem)}
                                                    key={foodItem.FoodItemID}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                >
                                                    <div className={`card rounded-2 position-relative bg-${isDarkMode ? 'dark' : 'light'} bg-opacity-50 food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                                        <img className="card-img-top  rounded-top" src={items[index % images.length]} alt="Card image cap" />
                                                        <div className="position-absolute d-flex justify-content-between w-100">
                                                            <div className="bg-danger ms-2 p-1 pt-2 fs-6 fw-medium text-black bg-opacity-100 ">{foodItem.FoodItemDiscount}%</div>
                                                            <div className=" p-2 fs-5 fw-lighter bg-opacity-10 text-white"><i className="fa-solid fa-heart"></i></div>
                                                        </div>

                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className="card-title fs-6 text-dark fw-light ">{foodItem.Name}</h5>
                                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className='text-dark fw-lighter' style={{ fontSize: "14px" }}>American Food, Fast Food</p>
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className="card-title fs-6 text-dark fw-light ">${foodItem.Price}</h5>
                                                                <Rating
                                                                    readonly
                                                                    className='text-success'
                                                                    initialRating="4"
                                                                    emptySymbol={<i className="far fa-star"></i>}
                                                                    fullSymbol={<i className="fas fa-star"></i>}
                                                                />
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className="card-title fs-6 text-dark fw-light ">30-40min</h5>
                                                            </div>
                                                        </div>
                                                        <div className="card-footer" style={{ zIndex: 2 }}>
                                                            <button className="btn btn-warning btn-sm btn-hover z-3" onClick={() => handleAddToCart(foodItem)}>
                                                                Add to Bucket
                                                            </button>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">

                                <div className="col-12 col-md-9">
                                    <div className="container">
                                        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                                            {foodItems.slice(0, 6).map((foodItem, index) => (
                                                <button
                                                    className="border-0 bg-transparent"
                                                    onClick={() => showDetails(foodItem)}
                                                    key={foodItem.FoodItemID}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                >
                                                    <div className={`card  position-relative  rounded-2 bg-${isDarkMode ? 'dark' : 'light'} bg-opacity-50 food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                                        <img className="card-img-top rounded-top" src={items[index % images.length]} alt="Card image cap" />
                                                        <div className="position-absolute d-flex justify-content-between w-100">
                                                            <div className="bg-danger ms-2 p-1 pt-2 fs-6 fw-medium text-black bg-opacity-100 ">{foodItem.FoodItemDiscount}%</div>
                                                            <div className=" p-2 fs-5 fw-lighter bg-opacity-10 text-white"><i className="fa-solid fa-heart"></i></div>
                                                        </div>

                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className="card-title fs-6 text-dark fw-light ">{foodItem.Name}</h5>
                                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className='text-dark fw-lighter' style={{ fontSize: "14px" }}>American Food, Fast Food</p>
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className="card-title fs-6 text-dark fw-light ">${foodItem.Price}</h5>
                                                                <Rating
                                                                    readonly
                                                                    className='text-success'
                                                                    initialRating="4"
                                                                    emptySymbol={<i className="far fa-star"></i>}
                                                                    fullSymbol={<i className="fas fa-star"></i>}
                                                                />
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className="card-title fs-6 text-dark fw-light ">30-40min</h5>
                                                            </div>
                                                        </div>
                                                        <div className="card-footer" style={{ zIndex: 2 }}>
                                                            <button className="btn btn-warning btn-sm z-3" onClick={() => handleAddToCart(foodItem)}>
                                                                Add to Bucket
                                                            </button>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}


                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3 d-none d-md-block position-relative">
                                    <div className="position-absolute top-0 start-50 translate-middle-x w-50" style={{ zIndex: 1, marginTop: "30px", marginLeft: "-40px" }}>
                                        <div className="bg-light bg-opacity-25 p-3">
                                            <h5 className="text-white fw-bold fs-3">Most Popular Near You</h5>
                                        </div>
                                    </div>
                                    <div className="image-container" style={{ height: window.innerWidth < 1200 ? "70rem" : "46rem" }}>
                                        <img src={asside2} alt="Image of girl eating pizza" className="img-fluid" style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                                    </div>


                                    <div className="position-absolute bottom-0 start-50 translate-middle-x text-center w-100" style={{ zIndex: 1, marginBottom: "60px" }}>
                                        <button className="btn btn-light w-75">See All</button>
                                    </div>
                                </div>
                            </div>



                        <div className="row row-cols-1 row-cols-md-2 g-4 mt-5">
                                <div className="col">
                                    <div className="position-relative">
                                        <img src={asside2} className="w-100" style={{ height: "20rem" }} alt="Image 1" />
                                        <button className="btn btn-light bg-opacity-25  position-absolute bottom-0 start-0 m-3">Explore More</button>
                                    </div>
                                </div>
                                <div className="col position-relative">
                                    <img src={asside1} className="w-100" style={{ height: "20rem" }} alt="Image 2" />
                                    <button className="btn btn-light bg-opacity-25 position-absolute bottom-0 start-0 m-3">Top rated</button>
                                </div>

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
