import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImg from '../assets/robot.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from './Hooks/DarkModeContext';

const Signup = () => {
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
 
    if(isDarkMode){
        document.body.style.backgroundColor = 'black'
    }else{
        document.body.style.backgroundColor = 'white'
        
    }

    return (
        
             <div className=" pt-2">
                <div className={`container  rounded-2 shadow-sm pb-5 px-5 mt-5 mb-5 bg-${isDarkMode? 'dark':'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <h1 className='fs-2 text-center fw-bold mb-5 pt-3'>Signup your Account</h1>
                <div className="row">
                    <div className="col">
                        <div className={` bg-light rounded-5 mt-3 p-4 bg-${isDarkMode? 'dark':'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                            <h1 className='fs-md-4 fs-lg-4 fs-5 mx-5'>Hey, Welcome to the Indian Restaurant</h1>
                            <img className='w-75 rounded-5 ' src={robotImg} alt="" />
                        </div>
                    </div>
                    <div className="col">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group my-2">
                                <label htmlFor="text">First Name</label>
                                <input type="text" className="form-control my-2" id="firstName" name="firstName" aria-describedby="firstName" onChange={onChange} placeholder="Enter First Name" />
                                <label htmlFor="text">Last Name</label>
                                <input type="text" className="form-control my-2" id="lastName" name="lastName" aria-describedby="lastName" onChange={onChange} placeholder="Enter Last Name" />
                                <label htmlFor="text">Email address</label>
                                <input type="email" className="form-control my-2" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email" />
                                <small id="emailHelp" className={`bg-${isDarkMode? 'dark':'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>{`We'll never share your email with anyone else.`}</small>
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control my-2 " id="password" name="password" minLength={5} required onChange={onChange} placeholder="Password" />
                                <label htmlFor="cpassword">Confirm Password</label>
                                <input type="password" className="form-control my-2 " id="cpassword" name="cpassword" minLength={5} required onChange={onChange} placeholder="Confirm Password" />
                            </div>
                            <button type="submit" className="btn btn-primary rounded-5 px-3" >Signup</button>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
             </div>
   
    );
}

export default Signup;
