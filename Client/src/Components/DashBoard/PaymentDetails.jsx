import { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import PaginationComponent from '../helper/PaginationComponent';

function PaymentDetails() {
    //TODO : N0
    const [payments, setPayments] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { isDarkMode } = useDarkMode();
    const [selectedItem, setSelectedItem] = useState('Payment-History');
    const [currentPage, setCurrentPage] = useState(1);
    // Logic to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    useEffect(() => {
        const token = Cookies.get('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        }
        fetch(`${apiUri}api/my-payments`, { headers })
            .then(response => response.json())
            .then(data => {
                // console.log('Payments data:', data); // Log the payments data
                setPayments(data.payments);
            })
            .catch(error => console.error('Error fetching payments:', error));

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
                    <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} mt-4`}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody  >
                            {payments.slice((currentPage - 1) * 6, currentPage * 6).map(payment => (
                                <tr key={payment.PaymentID}>
                                    <td>{payment.OrderID}</td>
                                    <td>{new Date(payment.PaymentDate).toLocaleString()}</td>
                                    <td>${payment.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="d-flex justify-content-center">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={Math.ceil(payments.length / 6)}
                        onPageChange={paginate}
                    />
                </div>
            </div>



        </>
    );
}

export default PaymentDetails;

