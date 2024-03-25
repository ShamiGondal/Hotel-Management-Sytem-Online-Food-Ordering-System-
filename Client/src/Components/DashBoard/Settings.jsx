import { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import { Button } from 'react-bootstrap';
import PaginationComponent from '../helper/PaginationComponent';
import { toast } from 'react-toastify'

import { Modal } from 'react-bootstrap'; // Assuming you're using React Bootstrap components


function Settings() {
    //TODO : N0
    const [userDetails, setUserDetails] = useState({});
    const [addresses, setAddresses] = useState([]);
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { isDarkMode } = useDarkMode();
    const [imageSrc, setImageSrc] = useState('');
    const [image, setImage] = useState(null);
    // const [selectedItem, setSelectedItem] = useState('Profile');
    const [currentPage, setCurrentPage] = useState(1);

    // Logic to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const [showModal, setShowModal] = useState(false);

    const [editedUserDetails, setEditedUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });


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

        fetch(`${apiUri}api/my-addresses`, { headers })
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(error => console.error('Error fetching addresses:', error));
    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    console.log(userDetails)


    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);
        const token = Cookies.get('token')
        await fetch(`${apiUri}api/uploadImage`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}` // Assuming token is stored in cookies
            },
            body: formData
        });

        alert('Image uploaded successfully');
    };


    useEffect(() => {
        const fetchImage = async () => {
            try {
                const token = Cookies.get('token')
                const response = await fetch(`${apiUri}api/my-Image`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                }); // Assuming user ID is 1
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, []);

 

    //FOR ADDRESS PAGINIATION IN ADDRESS PART
    const addressesPerPage = 3;
    const startIndex = (currentPage - 1) * addressesPerPage;
    const endIndex = Math.min(startIndex + addressesPerPage, addresses.length);
 


    // Define the fetchCustomerDetails function
    const fetchCustomerDetails = async () => {
        try {
            const token = Cookies.get('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            };

            const response = await fetch(`${apiUri}api/getCustomer`, { headers });
            const data = await response.json();
            // console.log("data",data)
            // setUserDetails(data);
            setEditedUserDetails({
                firstName: data.FirstName,
                lastName: data.LastNamea,
                email: data.Email,
                phoneNumber: data.PhoneNumber
            });
        } catch (error) {
            console.error('Error fetching Customer:', error);
        }
    };

    // Call fetchCustomerDetails inside useEffect
    useEffect(() => {
        fetchCustomerDetails();
        // Other fetch calls...
    }, []);


    const handleShowModal = () => {
        setEditedUserDetails(userDetails); // Set initial values to the current user details
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserDetails({
            ...editedUserDetails,
            [name]: value
        });
    };

    const handleSaveChanges = async () => {
        try {
            const token = Cookies.get('token')
            const response = await fetch(`${apiUri}api/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`

                },
                body: JSON.stringify(editedUserDetails)
            });

            if (!response.ok) {
                throw new Error('Failed to update user details');
            }

            setShowModal(false); // Close the modal after saving changes
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error scenario, e.g., show an error message to the user
        }
    };

    const removeAddress = (addressID) => {
        const token = Cookies.get('token'); // Assuming you're using cookies to store the token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        };

        fetch(`${apiUri}api/remove-address/${addressID}`, {
            method: 'DELETE',
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove address');
                }
                console.log('Address removed successfully');
                // After successfully removing the address, refetch the addresses
                toast.success("Address Removed")
            })
            .catch(error => {
                console.error('Error removing address:', error); // Log error message
            });
    };


    return (
        <>

            <div className="container mt-5 text-center" >
                <div className="main-body">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className={`card  bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img src={imageSrc} alt="User" className="rounded-circle p-1 bg-primary" width="150" />
                                        <div className="mt-3 align-items-center d-flex flex-column">
                                            <h4>{userDetails.FirstName}</h4>
                                            <small className='fst-italic '>welcome back !</small>
                                            <div className="col-md-6 ">

                                                <div className="d-flex justify-content-center">
                                                    <input type="file" onChange={handleImageChange} className="form-control mt-3" style={{ width: '100%' }} />
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <button onClick={handleUpload} className='btn btn-primary mt-3' style={{ width: '100%' }}>Upload Image</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <ul className="list-group list-group-flush">

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Full Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value={userDetails.FirstName} />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Last Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value={userDetails.LastName} />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value={userDetails.Email} />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Phone Number</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value={userDetails.PhoneNumber} />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Credits</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value={userDetails.Credits} disabled />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-3"></div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="button" className="btn btn-primary px-4" value="Edit" onClick={handleShowModal} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className={`card p-2 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}   align-items-center d-flex flex-column`}>
                                        <div className="row mt-5">
                                            {Array.isArray(addresses) && addresses.slice(startIndex, endIndex).map(address => (
                                                <div key={address.AddressID} className="col-lg-4 mb-4">
                                                    <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  shadow-lg  `}>
                                                        <div className="card-body">
                                                            <h5 className="card-title fs-6">Street: <small> {address.StreetAddress}</small> </h5>
                                                            <div className="d-flex gap-2" >
                                                                <p className="card-text">City: {address.City}</p>
                                                                <p className="card-text">State: {address.State}</p>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <p className="card-text">PostalCode: {address.PostalCode}</p>
                                                                <p className="card-text">Country: {address.Country}</p>
                                                            </div>
                                                            {/* <button className="btn btn-primary me-2">Edit</button> */}
                                                            <button className="btn btn-danger" onClick={() => removeAddress(address.AddressID)}>Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(addresses.length / addressesPerPage)}
                                            onPageChange={paginate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit User Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row mb-3">
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Full Name</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" name="FirstName" value={editedUserDetails.FirstName} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Last Name</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" name="LastName" value={editedUserDetails.LastName} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Email</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" name="Email" value={editedUserDetails.Email} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Phone Number</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" name="PhoneNumber" value={editedUserDetails.PhoneNumber} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Add similar input fields for other user details */}
                            </Modal.Body>


                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                                <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>



        </>
    );
}

export default Settings;

