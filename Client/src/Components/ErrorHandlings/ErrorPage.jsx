// ErrorPage.js
import { Link } from 'react-router-dom'; // If using React Router
import  RobotIcon  from '../../assets/robot.png'; // Assuming you have an SVG file for the robot icon

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="error-message">
        <h1>Oops! Something went wrong.</h1>
        <p>We apologize for the inconvenience.</p>
        <p>Please try refreshing the page or go back to the <Link to="/">home page</Link>.</p>
      </div>
        <img className='robot-icon '  src={RobotIcon} alt="404 ICON" />
     
    </div>
  );
};

export default ErrorPage;
