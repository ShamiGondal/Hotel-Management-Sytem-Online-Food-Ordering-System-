import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartContext } from '../Hooks/useCart';
// import defaultMainImage from '../../assets/aside2.jpg'
import { useDarkMode } from '../Hooks/DarkModeContext';
import Rating from 'react-rating';
import FoodLoader from '../helper/FoodLoader';
// import image3 from '../../assets/Pakistani+cuision.png'
// import image1 from '../../assets/image4.jpeg'
// import { Dropdown } from 'react-bootstrap';

// import image2 from '../assets/italain image2.jpg'

const FoodItemDetails = () => {
    const { id } = useParams();

    const { isDarkMode } = useDarkMode()
    const [mainImage, setMainImage] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const { addToCart, addSingleItemToCart, increaseQuantity,
        decreaseQuantity, cartItems } = useCartContext();
    const [item, setItem] = useState(null);
    const [sizes, setsizes] = useState([])
    const [specialSelection, setspecialSelection] = useState([])
    const [popularDishes, setPopularDishes] = useState([]);
    const navigate = useNavigate();
    const [customerReview, setCustomerReview] = useState([])
    const [imageSrc, setimageSrc] = useState([])
    const [addons, setAddons] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [previousMainImage, setPreviousMainImage] = useState(null);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedAdditions, setSelectedAdditions] = useState([]); // State for selected additions
    const [TotalPrice, setTotalPrice] = useState(0); // State for total price
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;



    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch(`${apiUri}api/getFoodItems/${id}`, {
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
        fetch(`${apiUri}api/getAddons`)
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
                const response = await fetch(`${apiUri}api/getFoodItems`);
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
            const response = await fetch(`${apiUri}api/my-Review`, {
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
                const response = await fetch(`${apiUri}api/customerReviews/${id}`, {
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
        return <div><FoodLoader /> </div>;
    }

    const updateMainImage = (image) => {
        setPreviousMainImage(mainImage); // Store the previous main image
        setMainImage(image);
    };


    const showDetails = (foodItem) => {

        navigate(`/FoodItemDetails/${foodItem.FoodItemID}`, { state: { item: foodItem } });
    }

    const scrollableContainerStyle = {
        maxHeight: '300px', // Adjust the height as needed
        overflowY: 'auto',
        borderRadius: '10px', // More rounded corners
        scrollbarWidth: 'thin', // Thin scrollbar
        scrollbarColor: 'red pink', // Pink scrollbar
        scrollbarTrackColor: 'transparent', // Hide scrollbar track
    };




    const handleAdditionChange = (e, item) => {
        const { checked } = e.target;
        const additionPrice = parseFloat(item.price); // Parse the price to ensure it's a number

        // Handle additions
        if (checked) {
            if (!selectedAdditions.includes(item)) { // Check if the item is already selected
                setSelectedAdditions([...selectedAdditions, item]);
                setTotalPrice(prevTotal => prevTotal + additionPrice); // Add the price of the selected addition
            }
        } else {
            setSelectedAdditions(selectedAdditions.filter(addition => addition !== item));
            setTotalPrice(prevTotal => prevTotal - additionPrice); // Subtract the price of the unselected addition
        }

        // Handle sizes
        const sizePrice = parseFloat(selectedSize.price); // Assuming selectedSize contains the currently selected size object
        if (sizePrice) {
            if (checked) {
                setTotalPrice(prevTotal => prevTotal + sizePrice); // Add the price of the selected size
            } else {
                setTotalPrice(prevTotal => prevTotal - sizePrice); // Subtract the price of the unselected size
            }
        }
    };

    const handleSizeChange = (e, item) => {
        const { checked } = e.target;
        if (checked) {
            if (selectedSize !== item) {
                setSelectedSize(item); // Set the selected size
                setTotalPrice(parseFloat(item.price)); // Update total price with the price of the selected size
            }
        } else {
            setSelectedSize(null); // Deselect the size
            setTotalPrice(prevTotal => prevTotal - parseFloat(selectedSize.price)); // Subtract the price of the deselected size
        }
    };


    const handleIncrease = (index) => {
        increaseQuantity(cartItems[index].FoodItemID);
    };

    const handleDecrease = (index) => {
        decreaseQuantity(cartItems[index].FoodItemID);
    };


    return (
        <div className="d-flex   ">
            <div className={`container  pt-5 mt-md-5 bg-${isDarkMode ? 'dark' : 'white'} text-${isDarkMode ? 'light' : 'dark'}`}>
                <div className="row">
                    <div className="col-md-6  ">
                    <h2 className={`fw-medium fs-3 text-${isDarkMode ? 'light' : 'dark'} d-md-none mb-4`}>{item.Title}</h2>
                        <div className='text-center text-md-start'>
                            <div className="main-image-container">
                                <img src={mainImage ? mainImage : (Array.isArray(item.ImageURL) ? item.ImageURL[0] : item.ImageURL)} alt="Main Image" className="main-image img-fluid h-75 w-75 rounded-2 " />
                            </div>
                            <div className="row h-25 mt-2 ms-5 ">
                                {item.ImageURL && Array.isArray(item.ImageURL) && item.ImageURL.map((image, index) => (
                                    <div key={index} className={`col-sm-6 mb-3 border-1 border border-dark btn  w-25 p-2 ${index > 0 ? 'ms-2' : ''}`}>
                                        <img src={image} className="small-image img-fluid" onClick={() => updateMainImage(image)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* for addons  */}
                        <div className="d-none d-md-block ">
                            <h6 className="mt-2 mb-2 fw-medium fs-5 ps-3">Addons</h6> {/* Top heading */}
                            <div className="mt-3 mb-3 border-1 rounded-2 border-black" style={scrollableContainerStyle}>
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
                                                    <button className="btn btn-danger  btn-sm fst-italic me-3" onClick={() => addSingleItemToCart(addon)}>Add</button>
                                                </div>
                                                <hr />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <h2 className={`fw-medium fs-3 text-${isDarkMode ? 'light' : 'dark'} d-none  d-md-block `}>{item.Title}</h2>
                            <h5 className={`fw-lighter fs-6 fst-italic  text-${isDarkMode ? 'light' : 'dark'} `}>{item.Subtitle}</h5>
                            <Rating
                                readonly
                                className={`text-${isDarkMode ? "success" : "warning"}`}
                                initialRating="4"
                                emptySymbol={<i className="far fa-star"></i>}
                                fullSymbol={<i className="fas fa-star"></i>}
                            />
                            <h5 className={`fw-light fs-6   text-${isDarkMode ? 'light' : 'dark'} `}>{item.Description}</h5>
                            <p>Total: <span className='ms-4 fw-medium'>${selectedSize ? TotalPrice : item.Price}</span></p>

                            {/* Dropdown for Sizes */}
                            <div className="mt-2" style={scrollableContainerStyle}>
                                <h6 className="ms-3 mt-2 mb-2">{"Size and Price *"}</h6> {/* Top heading */}
                                {sizes && sizes.map((item, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            className="form-check-input ms-3"
                                            type="checkbox"
                                            id={`size_${index}`}
                                            value={item.size}
                                            onChange={(e) => handleSizeChange(e, item)} // Only call handleSizeChange here
                                            checked={selectedSize && selectedSize.size === item.size}
                                        />


                                        <label className="form-check-label ms-3" htmlFor={`size_${index}`}>{`${item.size} - $${item.price}`}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Dropdown for Special Instructions */}
                            <div className="mt-2" style={scrollableContainerStyle}>
                                <h6 className="ms-3 mt-2 mb-2">{"Additions(Optional)"}</h6> {/* Top heading */}
                                {specialSelection && specialSelection.map((item, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            className="form-check-input ms-3"
                                            type="checkbox"
                                            id={`size_${index}`}
                                            value={item.selection}
                                            onChange={(e) => handleAdditionChange(e, item)} // Pass the item to the handler
                                        />
                                        <label className="form-check-label ms-3" htmlFor={`size_${index}`}>
                                            {`${item.selection} - $${item.price}`}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {/* for addons  */}
                            <div className=" d-md-none ">
                                <h6 className="mt-2 mb-2 fw-medium fs-5 ps-3">Addons</h6> {/* Top heading */}
                                <div className="mt-3 mb-3 border-1 rounded-2 border-black" style={scrollableContainerStyle}>
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
                                                        <button className="btn btn-danger  btn-sm fst-italic me-3" onClick={() => addSingleItemToCart(addon)}>Add</button>
                                                    </div>
                                                    <hr />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-auto d-flex justify-content-between mt-5 ">

                                <button className="btn btn-outline-warning" onClick={() => { addToCart(item, selectedSize, selectedAdditions) }}>Add to Cart</button>
                                <div className="d-flex align-items-center mb-2 ">
                                    <button className="btn btn-outline-warning btn-sm me-2" onClick={handleDecrease}>
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                    <span className='text-danger'>{item.quantity}</span>
                                    <button className="btn btn-outline-warning btn-sm ms-2" onClick={handleIncrease}>
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>
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
                                            {item.ImageURL && (
                                                Array.isArray(item.ImageURL) ? (
                                                    <img className="card-img-top rounded-top" src={item.ImageURL[0]} alt={`First Image`} />
                                                ) : (
                                                    <img className="card-img-top rounded-top" src={item.ImageURL} alt="Card image cap" />
                                                )
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{item.Title}</h5>
                                                <p className="card-text">{item.Subtitle}</p>
                                                <a href="#" className="btn btn-primary btn-sm" onClick={() => addSingleItemToCart(item)}>Re-Order</a>
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
                       <FoodLoader/>
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
