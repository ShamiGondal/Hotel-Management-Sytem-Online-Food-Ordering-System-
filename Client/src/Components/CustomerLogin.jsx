import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';
const CustomerLogin = () => {

    //Todos , not able to set the background Image of Login Page
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const localhost = 'http://localhost:4000/';
    const navigate = useNavigate();

    const { isDarkMode } = useDarkMode();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${localhost}api/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (response.ok) {
                toast.success('Successfully Logged In!');
                document.cookie = `token=${data.token};max-age=${60 * 60};path=/`;
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                // Login failed, handle accordingly
            }
        } catch (error) {
            console.error('Error logging in:', error);
            // Handle error, show error message, etc.
        }
    };


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black'
    } else {
        document.body.style.backgroundColor = 'white'

    }
    // document.body.style.backgroundImage = "url('../assets/brooke-lark-wMzx2nBdeng-unsplash.jpg')";

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="container mt-5 pt-5 ">
        <div className={``} >
            <h1 className={`fs-2 text-center fw-bold mb-5 pt-3 text-${isDarkMode ? 'light' : 'dark'}`}>Welcome Back !</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className={`card  shadow-sm bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} p-5 rounded-3`}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} placeholder="Enter email" />
                                <small id="emailHelp" className="form-text text-muted">{`We'll never share your email with anyone else.`}</small>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Password" />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                            </div>
                            <button type="submit" className="btn btn-success w-100 mb-3">Login</button>
                            <p className="text-center mb-0">Don't have an account? <Link to="/Signup">Create a new account</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
    
    );
};

export default CustomerLogin;
