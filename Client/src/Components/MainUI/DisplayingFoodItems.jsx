import { useEffect, useState } from 'react';
import image1 from '../../assets/carsouleImge_1.png'
import image2 from '../../assets/carsouleImge_2.jpg'
import image3 from '../../assets/carsouleImge_3.jpg'
import asside1 from '../../assets/aside1.jpg'
import asside2 from '../../assets/aside2.jpg'
// import item1 from '../assets/item2.webp'
// import item2 from '../assets/item4.jpg'
// import item3 from '../assets/item5.webp'
// import item4 from '../assets/item6.jpg'
// import item5 from '../assets/item1.webp'
import Rating from 'react-rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../Hooks/DarkModeContext';
// import Cart from './Cart';
import FoodLoader from '../helper/FoodLoader';
import { useCartContext } from '../Hooks/useCart';
import Cookies from 'js-cookie';




function DisplayingFoodItems() {

    const [isLoading, setIsLoading] = useState(true);
    const { isDarkMode } = useDarkMode();
    const { addToCart } = useCartContext();
    const [foodItems, setFoodItems] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;


    useEffect(() => {
        fetch(`${apiUri}api/getFoodItems`)
            .then(response => response.json())
            .then(data => setFoodItems(data))
            .catch(error => console.error('Error fetching food items:', error));
        setIsLoading(false);
        console.log("fooditems", foodItems)
    }, []);




    const navigate = useNavigate();



    const getUniqueCategories = (foodItems) => {
        const uniqueCategories = [];
        foodItems.forEach(item => {
            if (!uniqueCategories.includes(item.Category)) {
                uniqueCategories.push(item.Category);
            }
        });
        return uniqueCategories;
    };

    const categories = getUniqueCategories(foodItems); // Assuming foodItems is your data array




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
    const pastOrdershandle = () => {
        navigate('/My-Home/Orders')
    }
    const handleseeCetogries = () => {
        navigate('/FoodMenu')
    }

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        // Fetch recent orders from the backend
        async function fetchRecentOrders() {
            try {
                // Include the token in the request headers
                const token = Cookies.get('token'); // Replace 'your_token_here' with your actual token
                const response = await fetch(`${apiUri}api/my-recent-orders`, {
                    method: 'GET',
                    headers: {
                        'Authorization': token
                    }
                });
                const data = await response.json();
                setRecentOrders(data.recentOrders);
                console.log("recent orders", recentOrders)
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            }
        }

        fetchRecentOrders();
    }, []);



    return (
        <>

            <div className={`food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                    <div className="carousel-inner">
                        <div className={`carousel-item active text-center text-${isDarkMode ? 'light' : 'dark'} `}>
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
                {/* alert */}

                {/* <div className="alert alert-custom p-2 alert-dismissible show text-decoration-none " role="alert" style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderColor: '#f5c6cb',
                    zIndex: 1,
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <Link to='/FoodItemDetails/9' className="d-flex  flex-column align-items-center text-decoration-none" style={{ color: '#721c24' }} >
                        <div>
                            <img src={image3} alt="Hot Offer" style={{ marginRight: '10px', width: '50px', height: '50px' }} />
                            <strong>Hot Offer:</strong> {`Here is the hot offer from our restaurant. Don't miss it!`}
                        </div>
                        <div>
                            {`Just In `}<strong>$20</strong> {`Hurry up !`}
                        </div>
                    </Link>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div> */}

                {isLoading ? (
                    <FoodLoader />
                ) : (
                    <>
                        <div className="d-md-flex justify-content-between container mt-5  ">
                            <h4 className='mt-3 fw-medium  '>Browse by Cetogries </h4>
                            <button className='mt-3  text-danger  bg-transparent border-0 mb-4 border fw-medium ' onClick={handleseeCetogries}>see all Cetogries </button>
                        </div>
                        <div className="d-flex position-relative justify-content-center">
                            <div className="categories-wrapper" style={{ width: '75%' }}>
                                <div className="categories-scrollable">
                                    <div className="d-flex flex-nowrap overflow-auto">
                                        {categories.map((category, index) => (
                                            <div key={index} className="category-item-wrapper me-3">
                                                <div
                                                    onClick={() => navigate('/FoodMenu')} style={{ cursor: "pointer" }}
                                                    className={`category-item bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}
                                                >
                                                    <img src={images[index % images.length]} className="d-block rounded-circle" alt="..." style={{ width: '140px', height: '130px' }} />
                                                </div>
                                                <div className="text-center">
                                                    <h5 className='fs-6 fw-light text-body-emphasis'>{category}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {recentOrders && recentOrders.length > 0 ? (<div className="container mt-5 mb-3">
                            <div className=" d-md-flex justify-content-between align-items-center">
                                <h4 className='fw-medium mb-2'>Your Previous Orders</h4>
                                <Link to="/My-Home?order=true" className='text-danger bg-transparent border-0 border fw-medium mb-2' style={{ textDecoration: "none" }} >See All Past Orders</Link>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-2 mt-md-0">
                                {recentOrders.map((order, index) => (
                                    <div key={index} className="col mb-3">
                                        <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `} style={{ width: "17rem" }}>
                                            {order.ImageURL && Array.isArray(order.ImageURL) && (
                                                <div className="h-25">
                                                    <img className="card-img-top" style={{ height: "200px" }} src={order.ImageURL[0]} alt="Card image cap" />
                                                </div>
                                            )}

                                            <div className="card-body">
                                                <h5 className="card-title">{order.Title}</h5>
                                                <p className="card-text">{order.Subtitle}</p>
                                                <p className="card-text">Price: ${order.Price}</p>
                                                <button onClick={() => addToCart(order)} className="btn btn-primary btn-sm">Re-Order</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>) : (
                            <div className=""></div>
                        )}

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
                                            {foodItems.slice(0, 6).map((foodItem) => (
                                                <button
                                                    className="border-0 bg-transparent"
                                                    onClick={() => showDetails(foodItem)}
                                                    key={foodItem.FoodItemID}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                >
                                                    <div className={`card  position-relative  rounded-2 bg-${isDarkMode ? 'dark' : 'light'} bg-opacity-50 food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                                        {foodItem.ImageURL && (
                                                            Array.isArray(foodItem.ImageURL) ? (
                                                                <img className="card-img-top rounded-top" src={foodItem.ImageURL[0]} alt={`First Image`} />
                                                            ) : (
                                                                <img className="card-img-top rounded-top" src={foodItem.ImageURL} alt="Card image cap" />
                                                            )
                                                        )}
                                                        <div className="position-absolute d-flex justify-content-between w-100">
                                                            <div className="bg-danger ms-2 p-1 pt-2 fs-6 fw-medium text-black bg-opacity-100 ">{foodItem.FoodItemDiscount}%</div>
                                                            <div className=" p-2 fs-5 fw-lighter bg-opacity-10 text-white"><i className="fa-solid fa-heart"></i></div>
                                                        </div>

                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6  fw-light text-${isDarkMode ? 'light' : 'dark'}`}>{foodItem.Title}</h5>
                                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className={`text-${isDarkMode ? 'light' : 'dark'} fw-lighter`} style={{ fontSize: "14px" }}>{foodItem.Subtitle}</p>
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-light `}>${foodItem.Price}</h5>
                                                                <Rating
                                                                    readonly
                                                                    className={`text-${isDarkMode ? "success" : "warning"}`}
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
                            </div>
                            <div className="row mt-5">

                                <div className="col-12 col-md-9">
                                    <div className="container">
                                        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                                            {foodItems.slice(6, 19).map((foodItem, index) => (
                                                <button
                                                    className="border-0 bg-transparent"
                                                    onClick={() => showDetails(foodItem)}
                                                    key={foodItem.FoodItemID}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                >
                                                    <div className={`card  position-relative  rounded-2 bg-${isDarkMode ? 'dark' : 'light'} bg-opacity-50 food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                                        {foodItem.ImageURL && (
                                                            Array.isArray(foodItem.ImageURL) ? (
                                                                <img className="card-img-top rounded-top" src={foodItem.ImageURL[0]} alt={`First Image`} />
                                                            ) : (
                                                                <img className="card-img-top rounded-top" src={foodItem.ImageURL} alt="Card image cap" />
                                                            )
                                                        )}

                                                        <div className="position-absolute d-flex justify-content-between w-100">
                                                            <div className="bg-danger ms-2 p-1 pt-2 fs-6 fw-medium text-black bg-opacity-100 ">{foodItem.FoodItemDiscount}%</div>
                                                            <div className=" p-2 fs-5 fw-lighter bg-opacity-10 text-white"><i className="fa-solid fa-heart"></i></div>
                                                        </div>

                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6  fw-light text-${isDarkMode ? 'light' : 'dark'}`}>{foodItem.Title}</h5>
                                                                <h5 className="bg-success p-1 fs-6 fw-lighter bg-opacity-100 text-white">4.1</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className={`text-${isDarkMode ? 'light' : 'dark'} fw-lighter`} style={{ fontSize: "14px" }}>{foodItem.Subtitle}</p>
                                                            </div>
                                                            <div className='d-flex justify-content-between'>
                                                                <h5 className={`card-title fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-light `}>${foodItem.Price}</h5>
                                                                <Rating
                                                                    readonly
                                                                    className={`text-${isDarkMode ? "success" : "warning"}`}
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
