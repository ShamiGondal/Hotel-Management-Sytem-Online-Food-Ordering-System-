import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartContext } from './Hooks/useCart';
import defaultMainImage from '../assets/aside2.jpg'
import { useDarkMode } from './Hooks/DarkModeContext';
import Rating from 'react-rating';
import image3 from '../assets/Pakistani+cuision.png'
import image1 from '../assets/image4.jpeg'
import { Dropdown } from 'react-bootstrap';

import image2 from '../assets/italain image2.jpg'

const FoodItemDetails = () => {
    const { id } = useParams();

    const { isDarkMode } = useDarkMode()
    const [mainImage, setMainImage] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const { addToCart } = useCartContext();
    const [item, setItem] = useState(null);
    const [sizes, setsizes] = useState([])
    const [specialSelection, setspecialSelection] = useState([])
    const [popularDishes, setPopularDishes] = useState([]);
    const navigate = useNavigate();
    const [customerReview, setCustomerReview] = useState([])
    const [imageSrc, setimageSrc] = useState([])
    const [addons, setAddons] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state


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
                console.log(data);
                if (data && data.length > 0) {
                    // Parse sizes and specialSelections from JSON strings into arrays
                    const parsedData = {
                        ...data[0],
                        Sizes: JSON.parse(data[0].Sizes),
                        SpecialSelection: JSON.parse(data[0].SpecialSelection) // Corrected variable name
                    };
                    setItem(parsedData);
                    setsizes(parsedData.Sizes); // Corrected state variable name
                    setspecialSelection(parsedData.SpecialSelection);
                    console.log(specialSelection)// Corrected state variable name
                } else {
                    throw new Error('Food item not found');
                }
            } catch (error) {
                console.error('Error fetching food item:', error);
            }
        };

        fetchFoodItem();
    }, [id]);

    useEffect(() => {
        fetch('http://localhost:4000/api/getAddons')
            .then(response => response.json())
            .then(data => {
                setAddons(data);
                console.log(addons)
            })
            .catch(error => console.error('Error fetching addons:', error));
    }, []);


    //popular dishses
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/getFoodItems');
                if (!response.ok) {
                    throw new Error('Failed to fetch food items');
                }
                const data = await response.json();
                // Filter food items with the category "Popular Dishes"
                const popularItems = data.filter(item => item.Category === "Popular Dishes");
                setPopularDishes(popularItems);
            } catch (error) {
                console.error('Error fetching food items:', error);
            }
        };

        fetchData();
    }, []);


    const handleReviewSubmit = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch('http://localhost:4000/api/my-Review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`
                },
                body: JSON.stringify({
                    FoodItemID: id,
                    Rating: rating,
                    Comment: reviewText,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit review');
            } else {
                setRating('')
                setReviewText('')
            }

        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };


    useEffect(() => {
        const fetchCustomerReview = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch(`http://localhost:4000/api/customerReviews/${id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch customer review');
                }
                const data = await response.json();

                // Iterate through each review object and fetch its image
                // const promises = data.map(async (review) => {
                //     const imageBuffer = review.ImageData; // Assuming the property name is ImageData
                //     const blob = new Blob([Buffer.from(imageBuffer)], { type: 'image/jpeg' }); // Adjust the type according to your image format
                //     const imageUrl = URL.createObjectURL(blob);
                //     setIsLoading(false)
                //     return { ...review, imageUrl };
                // });

                // // Wait for all promises to resolve
                // const customerReviewsWithImages = await Promise.all(promises);

                // Update state with customer review details
                setCustomerReview(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching customer review:', error);
            }
        };

        fetchCustomerReview();
    }, [id])


    if (!item) {
        return <div>Loading...</div>;
    }

    const updateMainImage = (src) => {
        setMainImage(src);
    };


    const showDetails = (foodItem) => {

        navigate(`/FoodItemDetails/${foodItem.FoodItemID}`, { state: { item: foodItem } });
    }

    const scrollableContainerStyle = {
        maxHeight: '200px', // Adjust the height as needed
        overflowY: 'auto',
        borderRadius: '10px', // Rounded scrollbar
        scrollbarWidth: 'thin', // Thin scrollbar
        scrollbarColor: 'pink pink', // Pink scrollbar

    };



    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className={`container mt-5 pt-5 bg-${isDarkMode ? 'dark' : 'white'} text-${isDarkMode ? 'light' : 'dark'}`}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="main-image-container">
                            <img src={mainImage ? mainImage : item.ImageURL} alt="Main Image" className="main-image img-fluid h-75 w-75 rounded-2 " />
                        </div>
                        <div className="row h-25 mt-2 ms-5 ">
                            <div className="col-sm-6 mb-3 border-1 border border-dark btn  w-25 p-2 ">
                                <img src={image1} className="small-image img-fluid " onClick={() => updateMainImage(image1)} />
                            </div>
                            <div className="col-sm-6 mb-3 border-1 border border-dark btn  w-25 p-2  ms-2">
                                <img src={image2} className="small-image img-fluid " onClick={() => updateMainImage(image2)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">

                        <div className="col-md-12">
                            <h2 className={`fw-medium fs-3 text-${isDarkMode ? 'light' : 'dark'}`}>{item.Title}</h2>
                            <h5 className={`fw-lighter fs-6 fst-italic  text-${isDarkMode ? 'light' : 'dark'} `}>{item.Subtitle}</h5>
                            <Rating
                                readonly
                                className={`text-${isDarkMode ? "success" : "warning"}`}
                                initialRating="4"
                                emptySymbol={<i className="far fa-star"></i>}
                                fullSymbol={<i className="fas fa-star"></i>}
                            />
                            <h5 className={`fw-light fs-6   text-${isDarkMode ? 'light' : 'dark'} `}>{item.Description}</h5>
                            <p>Price <span className='ms-4 fw-medium'>${item.Price}</span></p>

                            {/* Dropdown for Sizes */}
                            <div className="mt-2" style={scrollableContainerStyle}>
                                <h6 className="ms-3 mt-2 mb-2">{"Size *"}</h6> {/* Top heading */}
                                {sizes && sizes.map((size, index) => (
                                    <div key={index} className="mb-2">
                                        <input className="form-check-input ms-3" type="checkbox" id={`size_${index}`} value={size} />
                                        <label className="form-check-label ms-3" htmlFor={`size_${index}`}>{size}</label>
                                    </div>
                                ))}
                            </div>
                            {/* Dropdown for Special Instructions */}
                            <div className="mt-2" style={scrollableContainerStyle}>
                                <h6 className="ms-3 mt-2 mb-2">{"Additions(Optional)"}</h6> {/* Top heading */}
                                {specialSelection && specialSelection.map((selection, index) => (
                                    <div key={index} className="mb-2">
                                        <input className="form-check-input ms-3" type="checkbox" id={`selection_${index}`} value={selection} />
                                        <label className="form-check-label ms-3" htmlFor={`selection_${index}`}>{selection}</label>
                                    </div>
                                ))}
                            </div>
                            {/* for addons  */}
                            <h6 className="mt-2 mb-2 ps-3">Addons</h6> {/* Top heading */}
                            <div className="mt-3 mb-3" style={scrollableContainerStyle}>
                                {addons.map((addon, index) => (
                                    <div key={index} className=" mb-3 p-3">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img src={addon.ImageURL} className="img-fluid rounded-start" alt="Addon" style={{ height: "50px", width: "50px" }} />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body d-flex justify-content-around">
                                                    <div className="">
                                                        <h5 className="card-title fs-6 fst-italic me-3">{addon.Title}</h5>
                                                        <h6 className="card-subtitle mb-2 text-muted fs-6 fst-italic me-3">{addon.Subtitle}</h6>
                                                    </div>
                                                    <p className="card-text fs-6 fst-italic me-3">Price: ${addon.Price}</p>
                                                    <button className="btn btn-danger  btn-sm fst-italic me-3" onClick={() => addToCart(addon)}>Add</button>
                                                </div>
                                                <hr />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className="w-auto">
                                <button className="btn btn-outline-success mt-2" onClick={() => { addToCart(item) }}>Add to Cart</button>
                            </div>
                        </div>


                    </div>
                </div>
                <div className=" mt-5">
                    <h2 className={`fw-medium fs-3 text-${isDarkMode ? 'light' : 'dark'}`}>Poular Dishes</h2>
                    <div className="container mt-5 mb-3">
                        <div className=" d-md-flex justify-content-between align-items-center">
                            <button className='text-danger bg-transparent border-0 border fw-medium' onClick={() => navigate('/FoodMenu')}>See All Popular Dishes</button>
                        </div>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-3">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-3">
                                {popularDishes.slice(0, 4).map((item, index) => (
                                    <div key={index} className="col mb-3" >
                                        <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`} style={{ width: "17rem", cursor: "pointer" }} onClick={() => showDetails(item)}>
                                            <img className="card-img-top" src={item.ImageURL} alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.Title}</h5>
                                                <p className="card-text">{item.Subtitle}</p>
                                                <a href="#" className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>Re-Order</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="customer-reviews">
                    <h2 className={`fw-medium fs-3 text-${isDarkMode ? 'light' : 'dark'}`}>Reviews</h2>
                    {isLoading ? (
                        <p>Loading reviews...</p>
                    ) : customerReview && customerReview.length > 0 ? (
                        customerReview.map((review, index) => (
                            <div className="" key={index} style={{ height: "150px" }}>
                                <div className="">
                                    <div className="d-flex align-items-center">
                                        {review.ImageURL ? (
                                            <img
                                                src={review.ImageURL}
                                                alt="User"
                                                className="user-image me-3 rounded-circle border border-1 border-primary"
                                                style={{ height: "100%", width: "100%", objectFit: "cover", boxSizing: "border-box" }}
                                            />
                                        ) : (
                                            <i className="rounded-circle border border-1 border-primary fa-solid fa-user text-primary d-flex justify-content-center align-items-center " style={{ height: "40px", width: "40px", objectFit: "cover", boxSizing: "border-box", marginRight: "10px" }}></i>
                                        )}


                                        <div>
                                            <Rating
                                                initialRating={review.Rating}
                                                className='text-warning'
                                                emptySymbol={<i className="far fa-star"></i>}
                                                fullSymbol={<i className="fas fa-star"></i>}
                                                readonly
                                            />
                                            <p className="card-text italic">{review.Comment}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>


                <div className="mt-5 ">
                    <h3 className={`fw-medium fs-4 text-${isDarkMode ? 'light' : 'dark'} mb-4`}>Leave a Review</h3>
                    <div className="mb-3">
                        <textarea
                            className={`form-control border-1  border-success bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}
                            rows="3"
                            placeholder="Enter your review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <Rating
                            className='text-warning fs-5'
                            initialRating={rating}
                            onChange={(value) => setRating(value)}
                            emptySymbol={<i className="far fa-star"></i>}
                            fullSymbol={<i className="fas fa-star"></i>}
                        />
                    </div>
                    <button className="btn btn-danger mt-3 mb-5" onClick={handleReviewSubmit}>
                        Submit Review
                    </button>
                </div>
            </div>
        </div>



    );
};

export default FoodItemDetails;
