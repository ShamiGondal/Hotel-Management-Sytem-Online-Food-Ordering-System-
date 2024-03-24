import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from './Hooks/DarkModeContext';
const Signup = () => {

    //TODO : Not able to set the background Image of this page
    const localhost = `http://localhost:4000/`;
    const { isDarkMode } = useDarkMode();
    const Navigate = useNavigate();
    function generateNumericID() {

        return Math.floor(Math.random() * 10000000); // Change range according to your requirement
    }
    const [formData, setFormData] = useState({
        customerID: generateNumericID(),
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        cpassword: '',
        credits: 0,
        phoneNumber: ''
    });


    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.cpassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const response = await fetch(`${localhost}api/CreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            await response.json();

            if (response.ok) {
                toast.success("Successfuly created account !")
                setFormData({
                    customerID: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    cpassword: '',
                    credits: 0,
                    phoneNumber: ''
                });
                setTimeout(() => {
                    Navigate('/login');
                }, 1000);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error("Any errors occurred while processing your request!");
        }
    };

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black'
    } else {
        document.body.style.backgroundColor = 'white'

    }

    return (

        <div className="pt-2">
            <div className="container">
                <div className={`mt-5`}>
                    <div className="card-body ">
                        <h1 className={`fs-2 fw-bold mb-5 pt-3 text-center text-${isDarkMode ? 'light' : 'dark'} `}>Signup your Account</h1>
                        <div className="row justify-content-center">
                            <div className=" col-md-6">
                                <div className={`card rounded-2 shadow-lg bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} py-4 px-3`}>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group my-2">
                                            <label htmlFor="text">First Name</label>
                                            <input type="text" className="form-control my-2" id="firstName" name="firstName" aria-describedby="firstName" onChange={onChange} placeholder="Enter First Name" />
                                            <label htmlFor="text">Last Name</label>
                                            <input type="text" className="form-control my-2" id="lastName" name="lastName" aria-describedby="lastName" onChange={onChange} placeholder="Enter Last Name" />
                                            <label htmlFor="text">Email address</label>
                                            <input type="email" className="form-control my-2" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email" />
                                            <small id="emailHelp" className={`bg-${isDarkMode ? 'dark' : 'light'} ${isDarkMode ? 'dark-mode' : ''}`}>{`We'll never share your email with anyone else.`}</small>
                                        </div>
                                        <div className="form-group my-3">
                                            <label htmlFor="exampleInputPassword1">Password</label>
                                            <input type="password" className="form-control my-2" id="password" name="password" minLength={5} required onChange={onChange} placeholder="Password" />
                                            <label htmlFor="cpassword">Confirm Password</label>
                                            <input type="password" className="form-control my-2" id="cpassword" name="cpassword" minLength={5} required onChange={onChange} placeholder="Confirm Password" />
                                        </div>
                                        <div className="form-group my-3">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control my-2"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                minLength={5}
                                                required={true}
                                                onChange={onChange}
                                                placeholder="+92-000-000-0000"
                                            />
                                        </div>

                                        <button type="submit" className={`btn btn-danger rounded-5 px-5 text-${isDarkMode ? "light" : "light"}`}>
                                            Signup <i className="bi bi-arrow-right"></i>
                                        </button>
                                        <div className="mt-3">
                                            Already have an account? <Link to="/Login">Login</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>





    );
}

export default Signup;
