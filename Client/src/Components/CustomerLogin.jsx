import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import robotImg from '../assets/robot.png';
import { ToastContainer, toast } from 'react-toastify';
import { useDarkMode } from './Hooks/DarkModeContext';

const CustomerLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const localhost = 'http://localhost:4000/';
    const navigate = useNavigate();

   const {isDarkMode} = useDarkMode();
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

            if(response.ok) {
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
  
    if(isDarkMode){
        document.body.style.backgroundColor = 'black'
    }else{
        document.body.style.backgroundColor = 'white'
        
    }

    return (
        <div className={`p-3 mt-5 pt-5` }>
            <div className={`container  rounded-2 shadow-sm pb-5 px-5 mt-2 mb-5  bg-${isDarkMode? 'dark':'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <h1 className="fs-2 text-center fw-bold mb-5 pt-3">Welcome Back !</h1>
                <div className="row">
                    <div className="col">
                        <div className={` bg-light rounded-5 mt-3 p-4  bg-${isDarkMode? 'dark':'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                            <h1 className="fs-md-4 fs-lg-4 fs-5 mx-5">Yup..!, Order Delicious Food</h1>
                            <img className="w-75 rounded-5 " src={robotImg} alt="" />
                        </div>
                    </div>
                    <div className="col p-3 w-25 mt-5">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group my-2">
                                <label htmlFor="text">Email address</label>
                                <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} placeholder="Enter email" />
                                <small id="emailHelp" className="form-text text-muted">{`We'll never share your email with anyone else.`}</small>
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Password" />
                                <small id='signup' className={` bg-${isDarkMode? 'dark':'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>{`Dont't have Account ?`}<Link to="/Signup" className='text-decoration-none hover:text-decoration-underline   ' >Create a new Account</Link> </small>
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CustomerLogin;
