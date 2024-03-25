import { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';

import PaginationComponent from '../helper/PaginationComponent';



function ReservationDetails() {
    //TODO : N0;
    const [reservations, setReservations] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { isDarkMode } = useDarkMode();
    const [isLoggedIn, setisLoggedIn] = useState(Cookies.get('token'))
    const [filteredReservationss, setFilteredReservations] = useState(reservations);
    const [selectedItem, setSelectedItem] = useState('Reservations');
    const [currentPage, setCurrentPage] = useState(1);
    // Logic to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const token = Cookies.get('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        fetch(`${apiUri}api/my-reservations`, { headers })
            .then(response => response.json())
            .then(data => setReservations(data))
            .catch(error => console.error('Error fetching reservations:', error));


    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }




    useEffect(() => {
        filteredReservations('Pending')
    }, [isLoggedIn]); // Empty dependency array to run only once when the component mounts


   
    //FOR FILTERD RESERVATIONS
    const filteredReservations = (status) => {
        const filtered = reservations.filter(reservation => reservation.Status === status);
        setFilteredReservations(filtered);
        setCurrentPage(1); // Reset to first page when changing filters
    };


    return (
        <>


            <div className="mt-5">
                <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                <div className="container-fluid mb-3">
                    <div className="row justify-content-start">
                        <div className="col">
                            <div className="d-flex gap-3 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <button className="btn btn-info fst-italic" onClick={() => filteredReservations('Pending')}>
                                    Pending
                                </button>
                                <button className="btn btn-success fst-italic" onClick={() => filteredReservations('Confirmed')}>
                                    Confirmed
                                </button>
                                <button className="btn btn-danger fst-italic" onClick={() => filteredReservations('Rejected')}>
                                    Rejected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                        <thead>
                            <tr>
                                <th>Reservation Date</th>
                                <th>Reservation Time</th>
                                <th>No of Tables</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservationss.slice((currentPage - 1) * 3, currentPage * 3).map(reservation => (
                                <tr key={reservation.id}>
                                    <td>{new Date(reservation.ReservationDate).toLocaleDateString()}</td>
                                    <td>{new Date(reservation.ReservationDate).toLocaleTimeString()}</td>
                                    <td>{reservation.NoOfTables}</td>
                                    <td>
                                        <span className={`badge bg-${reservation.Status === 'Pending' ? 'primary' : reservation.Status === 'Confirmed' ? 'success' : 'danger'} text-light fw-bold`}>
                                            {reservation.Status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-4">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredReservationss.length / 3)}
                        onPageChange={paginate}
                    />
                </div>
            </div>



        </>
    );
}

export default ReservationDetails;

