import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartContext } from './Hooks/useCart';
import defaultMainImage from '../assets/aside2.jpg'
import { useDarkMode } from './Hooks/DarkModeContext';
import Rating from 'react-rating';
import image3 from '../assets/Pakistani+cuision.png'
import image1 from '../assets/image4.jpeg'
import image2 from '../assets/italain image2.jpg'

const FoodItemDetails = () => {
    const { id } = useParams();

    const { isDarkMode } = useDarkMode()
    const [mainImage, setMainImage] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const {  addToCart } = useCartContext();
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



    const updateMainImage = (src) => {
        setMainImage(src);
    };

    const handleReviewSubmit = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/submitReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    foodItemId: id,
                    reviewText: reviewText,
                    rating: rating,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
            // Handle successful review submission
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

  

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className={`container mt-5 pt-5 bg-${isDarkMode ? 'dark' : 'white'} text-${isDarkMode ? 'light' : 'dark'}`}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="main-image-container">
                            <img src={mainImage ? mainImage : defaultMainImage} alt="Main Image" className="main-image img-fluid h-75 w-75 rounded-2 " />
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
                            <h2 className='fw-medium fs-3 text-dark'>{item.Name}</h2>
                            <h5 className='fw-lighter fs-6 fst-italic   text-dark'>with Garllic Souce</h5>
                            <Rating
                                readonly
                                className={`text-${isDarkMode ? "success" : "warning"}`}
                                initialRating="4"
                                emptySymbol={<i className="far fa-star"></i>}
                                fullSymbol={<i className="fas fa-star"></i>}
                            />
                            <h5 className='fw-light fs-6    text-dark'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid expedita facere voluptate quam aut? Nisi architecto ab vitae tempore veritatis molestiae illum ipsam ipsum perspiciatis nihil praesentium debitis perferendis repudiandae totam atque tenetur culpa sint voluptas, corporis animi optio sapiente. </h5>
                            <p>Price <span className='ms-4 fw-medium'>${item.Price}</span></p>
                        
                            <div className="w-auto">
                                <button className="btn btn-outline-success w-auto" onClick={() => { addToCart(item) }}>Add to Cart</button>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" mt-5">
                    <h2 className='fw-medium fs-3 text-dark'>Poular Dishes</h2>
                    <div className="container mt-5 mb-3">
                        <div className=" d-md-flex justify-content-between align-items-center">
                            <button className='text-danger bg-transparent border-0 border fw-medium'>See All Popular Dishes</button>
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
                </div>

                <div className="mt-5 ">
                    <h3 className='fw-medium fs-4 text-dark mb-4'>Leave a Review</h3>
                    <div className="mb-3">
                        <textarea
                            className="form-control border-1  border-success"
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
