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




function DisplayingFoodItems() {
    //TODO : Need to change button to remove from cart after adding to card , 
    //TODO: Have to fetch the last three prev order of customer and display them , for that need to understand the orderTables in database
    //TODO : Main issue of ceatogries buttons are not working , even not getting properly displayed
    const dispatch = useDispatch();
    const foodItems = useSelector(state => state.foodItems.items);
    // const loading = useSelector(state => state.foodItems.loading);
    // const error = useSelector(state => state.foodItems.error);
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
        setCurrentIndex((prevIndex) => {
            if (prevIndex === categories.length - 1) {
                return 0;
            } else {
                return prevIndex + 1;
            }
        });
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                return categories.length - 1;
            } else {
                return prevIndex - 1;
            }
        });
    };


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
    const pastOrdershandle = () => {
        navigate('/My-Home')
    }
    const handleseeCetogries = () => {
        navigate('/FoodMenu')
    }


    return (
        <>

            <div className={`food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                    <div className="carousel-inner">
                        <div className={`carousel-item active text-center text-${isDarkMode ? 'light': 'dark'} `}>
                            <img src={image1} className="d-block w-100" alt="Slide 1" />
                            <div className="carousel-caption d-none d-md-block position-absolute top-50 start-50 translate-middle  h-25 rounded-3    ">
                                <h1 className={`animate__animated animate__backInLeft fs-1 fw-bolder  `}>Pakistani Kahnoo ki kia baat ha!</h1>
                                <p className='animate__animated animate__backInLeft'>Try out our new Pakistani Dishes.</p>
                                <p className='animate__animated animate__backInLeft'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed rerum iusto magni?</p>
                            </div>
                        </div>
                        <div className="carousel-item text-center">
                            <img src={image2} className="d-block w-100" alt="Slide 2" />
                            <div className="carousel-caption d-none d-md-block  position-absolute top-50 start-50 translate-middle ">
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
                            <button className='mt-3  text-danger  bg-transparent border-0  border fw-medium ' onClick={handleseeCetogries}>see all Cetogries </button>
                        </div>
                        <div className=" d-flex position-relative justify-content-between  ">
                        <div className="navigation_left d-none d-md-block">
                                <button className="btn btn-light bg-transparent border-0 " onClick={handlePrevious}><i className="fa-solid fa-circle-chevron-left text-danger fs-3"></i></button>
                            </div>
                            <div className="container category-carousel">
                                <div className="categories   ">
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
                            </div>
                            <div className="navigation_right d-none d-md-block">
                                <button className="btn btn-light bg-transparent border-0 " onClick={handleNext}><i className="fa-solid fa-circle-chevron-right text-danger fs-3 "></i></button>
                            </div>
                        </div>

                        <div className="container mt-5 mb-3">
                            <div className=" d-md-flex justify-content-between align-items-center">
                                <h4 className='fw-medium'>Your Previous Orders</h4>
                                <button className='text-danger bg-transparent border-0 border fw-medium' onClick={pastOrdershandle}>See All Past Orders</button>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-3">
                                <div className="col mb-3">
                                    <div className={`card bg-${isDarkMode ? 'dark': 'light' } text-${isDarkMode ? 'light': 'dark'}  `} style={{ width: "17rem" }}>
                                        <img className="card-img-top " src={image1} alt="Card image cap" />
                                        <div className="card-body">
                                            <h5 className="card-title">Italian Chicken Pizza</h5>
                                            <p className="card-text">Italian Crust , 2-Drinks</p>
                                            <a href="#" className="btn btn-primary btn-sm">Re-Order</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className={`card bg-${isDarkMode ? 'dark': 'light' } text-${isDarkMode ? 'light': 'dark'}  `} style={{ width: "17rem" }}>
                                        <img className="card-img-top" src={image2} alt="Card image cap" />
                                        <div className="card-body">
                                            <h5 className="card-title">Kabab Chicken Pizza</h5>
                                            <p className="card-text">Italian Crust , 2-Drinks</p>
                                            <a href="#" className="btn btn-primary btn-sm">Re-Order</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className={`card bg-${isDarkMode ? 'dark': 'light' } text-${isDarkMode ? 'light': 'dark'} `} style={{ width: "17rem" }}>
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
                                    <div className="image-container" style={{ height: window.innerWidth < 1200 ? "70rem" : "47rem" }}>
                                        <img src={asside1} alt="Image of girl eating pizza" className="img-fluid" style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                                    </div>




                                    <div className="position-absolute bottom-0 start-50 translate-middle-x text-center w-100" style={{ zIndex: 1, marginBottom: "60px" }}>
                                        <button className="btn btn-light w-75" onClick={handleseeCetogries}>See All</button>
                                    </div>
                                </div>

                                <div className="col-12 col-md-9">
                                    <div className="container">
                                        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                                            {foodItems && foodItems.slice(0, 6).map((foodItem, index) => (
                                                <button
                                                    className="border-0 bg-transparent"
                                                    onClick={() => showDetails(foodItem)}
                                                    key={foodItem.FoodItemID}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                >
                                                    <div className={`card rounded-2 position-relative bg-${isDarkMode ? 'dark' : 'light'} bg-opacity-50 food-items-container text-${isDarkMode ? 'light' : 'dark'}`}>
                                                        <img className="card-img-top  rounded-top" src={items[index % images.length]} alt="Card image cap" />
                                                        <div className="position-absolute d-flex justify-content-between w-100">
                                                            <div className="bg-danger ms-2 p-1 pt-2 fs-6 fw-medium text-black bg-opacity-100 ">{foodItem.FoodItemDiscount}%</div>
                                                            <div className=" p-2 fs-5 fw-lighter bg-opacity-10 text-white"><i className="fa-solid fa-heart"></i></div>
                                                        </div>

                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6  fw-light text-${isDarkMode ? 'light' : 'dark'}`}>{foodItem.Name}</h5>
                                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className={`text-${isDarkMode ? 'light' : 'dark'} fw-lighter`} style={{ fontSize: "14px" }}>American Food, Fast Food</p>
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-light `}>${foodItem.Price}</h5>
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
                                                                <h5 className={`card-title fs-6  fw-light text-${isDarkMode ? 'light' : 'dark'}`}>{foodItem.Name}</h5>
                                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className={`text-${isDarkMode ? 'light' : 'dark'} fw-lighter`} style={{ fontSize: "14px" }}>American Food, Fast Food</p>
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-light `}>${foodItem.Price}</h5>
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
                                    <div className="image-container" style={{ height: window.innerWidth < 1200 ? "70rem" : "47rem" }}>
                                        <img src={asside2} alt="Image of girl eating pizza" className="img-fluid" style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                                    </div>


                                    <div className="position-absolute bottom-0 start-50 translate-middle-x text-center w-100" style={{ zIndex: 1, marginBottom: "60px" }}>
                                        <button className="btn btn-light w-75" onClick={handleseeCetogries}>See All</button>
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
        </>
    );
}

export default DisplayingFoodItems;
