import { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import PaginationComponent from '../helper/PaginationComponent';
function ComplaintDetails() {
    //TODO : N0
 
    const [complaints, setComplaints] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { isDarkMode } = useDarkMode();
    const [selectedItem, setSelectedItem] = useState('Complaints');
    const [currentPage, setCurrentPage] = useState(1);

    // Logic to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
 

    useEffect(() => {
        const token = Cookies.get('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        fetch(`${apiUri}api/my-complaints`, { headers })
            .then(response => response.json())
            .then(data => {
                // console.log('complaints data:', data);
                setComplaints(data)
            })
            .catch(error => console.error('Error fetching complaints:', error));

       

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
                                <th>Complaint ID</th>
                                <th>Complaint Text</th>
                                <th>Complaint Date</th>
                                <th>Complaint Type</th>
                                <th>Resolved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.slice((currentPage - 1) * 3, currentPage * 3).map(complaint => (
                                <tr key={complaint.ComplaintID}>
                                    <td>{complaint.ComplaintID}</td>
                                    <td>{complaint.ComplaintText}</td>
                                    <td>{new Date(complaint.ComplaintDate).toLocaleString()}</td>
                                    <td>{complaint.ComplaintType}</td>
                                    <td>
                                        <span className={`badge bg-${complaint.IsResolved ? 'success' : 'danger'} text-light fw-bold`}>
                                            {complaint.IsResolved ? 'Yes' : 'No'}
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
                        totalPages={Math.ceil(complaints.length / 3)}
                        onPageChange={paginate}
                    />
                </div>
            </div>



        </>
    );
}

export default ComplaintDetails;

