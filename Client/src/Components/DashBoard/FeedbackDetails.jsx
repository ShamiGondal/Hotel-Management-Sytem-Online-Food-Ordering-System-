import { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import StarRatings from 'react-star-ratings';
import PaginationComponent from '../helper/PaginationComponent';


function FeedbackDetails() {
    //TODO : N0
    const [userDetails, setUserDetails] = useState({});
    const [feedback, setFeedback] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { isDarkMode } = useDarkMode();

    const [selectedItem, setSelectedItem] = useState('Feedbacks');

    const [currentPage, setCurrentPage] = useState(1);
    // Logic to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  


    useEffect(() => {
        const token = Cookies.get('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        fetch(`${apiUri}api/getCustomer`, { headers })
            .then(response => response.json())
            .then(data => setUserDetails(data))
            .catch(error => console.error('Error fetching Customer:', error));
        fetch(`${apiUri}api/my-feedback`, { headers })
            .then(response => response.json())
            .then(data => setFeedback(data))
            .catch(error => console.error('Error fetching feedback:', error));

    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    return (
        <>


            <div className="container mt-5">
                <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                <div className="table-responsive">
                    <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Food Rating</th>
                                <th>Service Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.slice((currentPage - 1) * 3, currentPage * 3).map(feedbackItem => (
                                <tr key={feedbackItem.id}>
                                    <td>{feedbackItem.Comment}</td>
                                    <td>
                                        <StarRatings
                                            rating={feedbackItem.FoodRating}
                                            starRatedColor="#f7d70e"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
                                    </td>
                                    <td>
                                        <StarRatings
                                            rating={feedbackItem.ServiceRating}
                                            starRatedColor="#f7d70e"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-4">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={Math.ceil(feedback.length / 3)}
                        onPageChange={paginate}
                    />
                </div>
            </div>



        </>
    );
}

export default FeedbackDetails;

