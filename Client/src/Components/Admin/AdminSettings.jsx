import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImg from '../../assets/robot.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AdminSettings() {
    const localhost = `http://localhost:4000/`;
    function generateNumericID() {
        return Math.floor(Math.random() * 10000000); // Change range according to your requirement
    }
    const [formData, setFormData] = useState({
        adminID: generateNumericID(),
        userName: '',
        password: '',
        cpassword: '',
    });

    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch(`${localhost}api/getAdmins`);
            if (!response.ok) {
                throw new Error('Failed to fetch admins');
            }
            const adminsData = await response.json();
            setAdmins(adminsData);
            console.log(adminsData)
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

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
            const response = await fetch(`${localhost}api/addAdmin`, {
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
                    adminID: '',
                    userName: '',
                    password: '',
                    cpassword: '',
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error("Any errors occurred while processing your request!");
        }
    };

    return (
        <>
            <div className="container mt-5">
                <h4>Settings</h4>
                <hr />
                <div>

                    <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Existing Admins
                    </button>
                    <div className="collapse" id="collapseExample">
                        <div className="card card-body mt-3">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Admin ID</th>
                                        <th>Admin UserName</th>
                                        <th>Update</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin) => (
                                        <tr key={admin.AdminID}>
                                            <td>{admin.AdminID}</td>
                                            <td>{admin.UserName}</td>
                                            <td><button className='border  border-0  bg-transparent '><i className="fa-solid fa-pen-to-square text-primary "></i></button></td>
                                            <td><button className='border  border-0  bg-transparent '><i className="fa-solid fa-trash text-danger "></i></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>



                <div className="mt-3">
                    <div>
                        <p className="d-inline-flex gap-1">
                            <button className="btn btn-outline-info  " type="button" data-bs-toggle="collapse" data-bs-target="#collapseExamples" aria-expanded="false" aria-controls="collapseExamples">
                                Add New Admin
                            </button>
                        </p>
                        <div className="collapse" id="collapseExamples">
                            <div className="card card-body mt-3">
                                <div className="container bg-white rounded-2 shadow-sm pb-5 px-5 mt-2 mb-5">
                                    <h1 className='fs-2 text-center fw-bold mb-5 pt-3'>Add New Admin</h1>
                                    <div className="row">
                                        <div className="col">
                                            <div className=" bg-light rounded-5 mt-3 p-4 ">
                                                <h1 className='fs-md-4 fs-lg-4 fs-5 mx-5'>Creating New Admin</h1>
                                                <img className='w-75 rounded-5 ' src={robotImg} alt="" />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group my-2">
                                                    <label htmlFor="text">User Name</label>
                                                    <input type="text" className="form-control my-2" id="firstName" name="userName" aria-describedby="userName" onChange={onChange} placeholder="Enter User Name" />
                                                </div>
                                                <div className="form-group my-3">
                                                    <label htmlFor="exampleInputPassword1">Password</label>
                                                    <input type="password" className="form-control my-2 " id="password" name="password" minLength={5} required onChange={onChange} placeholder="Password" />
                                                    <label htmlFor="cpassword">Confirm Password</label>
                                                    <input type="password" className="form-control my-2 " id="cpassword" name="cpassword" minLength={5} required onChange={onChange} placeholder="Confirm Password" />
                                                </div>
                                                <button type="submit" className="btn btn-primary rounded-5 px-3" >Add Admin</button>
                                            </form>
                                        </div>
                                    </div>
                                    <ToastContainer />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default AdminSettings;
