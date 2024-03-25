import { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import PaginationComponent from '../helper/PaginationComponent';



function OrderDetails() {
    //TODO : N0
    const [userDetails, setUserDetails] = useState({});
    const [orders, setOrders] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { isDarkMode } = useDarkMode();
    const [isLoggedIn, setisLoggedIn] = useState(Cookies.get('token'))
    const [selectedItem, setSelectedItem] = useState('Orders');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10; // Change this to 10
    const [filteredOrders, setFilteredOrders] = useState([]);

    const filterOrders = (status) => {
        const filtered = orders.filter(order => order.Status === status);
        setFilteredOrders(filtered);
    };

    // Logic to get current orders based on pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
        fetch(`${apiUri}api/my-orders`, { headers })
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));

    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }


    useEffect(() => {
        filterOrders('Pending');
    }, [isLoggedIn]); // Empty dependency array to run only once when the component mounts



    return (
        <>

            <div className="mt-5">
                <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                <div className="container-fluid">
                    <div className="row justify-content-start">
                        <div className="col">
                            <div className="d-flex gap-3 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <button className="btn btn-info fst-italic" onClick={() => filterOrders('Pending')}>
                                    Pending
                                </button>
                                <button className="btn btn-success fst-italic" onClick={() => filterOrders('Confirmed')}>
                                    Confirmed
                                </button>
                                <button className="btn btn-danger fst-italic" onClick={() => filterOrders('Rejected')}>
                                    Rejected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'pink' }}>
                        <table className={`table table-striped  table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`} style={{ borderRadius: '15px' }}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                    <th>Payment Status</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.OrderID}</td>
                                        <td>
                                            <span className={`badge p-2 bg-${order.Status === 'Pending' ? 'primary' : order.Status === 'Confirmed' ? 'success' : 'danger'}`}>
                                                {order.Status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.OrderDate).toLocaleString()}</td>
                                        <td>{order.PaymentStatus}</td>
                                        <td>{order.TotalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredOrders.length / 10)} // Use filteredOrders length here
                        onPageChange={paginate}
                    />
                </div>
            </div>



        </>
    );
}

export default OrderDetails;

