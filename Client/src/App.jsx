import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/NavBar'
import CustomerLogin from './Components/CustomerLogin'
import CustomerSignup from './Components/CustomerSignup'
import AdminLogin from './Components/Admin/AdminLogin'
import AdminPortal from './Components/Admin/AdminPortal'
import Reservations from './Components/Reservations'
import Feedback from './Components/Feedback'
import Complaints from './Components/Complaints'
import FoodItems from './Components/Admin/FoodItems'
import CustomerOrders from './Components/Admin/CustomerOrders'
import CustomerReservations from './Components/Admin/CustomerReservations'
import CustomerDetails from './Components/Admin/CustomerDetails'
import CustomerPayments from './Components/Admin/CustomerPayments'
import CustomerFeedbacks from './Components/Admin/CustomerFeedbacks'
import AdminSettings from './Components/Admin/AdminSettings'
import DisplayingFoodItems from './Components/DisplayingFoodItems'
import { DarkModeProvider } from './Components/Hooks/DarkModeContext'
import TrackOrder from './Components/TrackOrder'
import StoreLocator from './Components/StoreLocator'
import PrivacyPolicy from './Components/PrivacyPolicy'
import Cart from './Components/Cart'
import FoodMenu from './Components/FoodMenu'
import Home from './Components/Home'


function App() {


  return (
    <>
      <BrowserRouter>
        <DarkModeProvider>
          <Routes>
            <Route path={'/'} element={<Navbar />} >
              <Route path={'/'} element={<DisplayingFoodItems />}></Route>
              <Route path={'/Login'} element={<CustomerLogin />}></Route>
              <Route path={'/Signup'} element={<CustomerSignup />}></Route>
              <Route path={'/My-Home'} element={<Home/>}></Route>
              <Route path={'/Reservations'} element={<Reservations />}></Route>
              <Route path={'/Feedbacks'} element={<Feedback />}></Route>
              <Route path={'/Complaints'} element={<Complaints />}></Route>
              <Route path={'/Reservations'} element={<Reservations/>}></Route>
              <Route path={'/Store-Locator'} element={<StoreLocator/>}></Route>
              <Route path={'/Track-Order'} element={<TrackOrder/>}></Route>
              <Route path={'/PrivacyPolicy'} element={<PrivacyPolicy/>}></Route>
              <Route path={'/cart'} element={<Cart/>}></Route>
              <Route path={'/FoodMenu'} element={<FoodMenu/>}></Route>
            </Route>
          </Routes>
        </DarkModeProvider>
        <Routes>
          <Route path={'/adminLogin'} element={<AdminLogin />}></Route>
          <Route path={'/adminPortal'} element={<AdminPortal />}></Route>
          <Route path='/Orders' element={<CustomerOrders />} />
          <Route path='/Customer-Reservations' element={<CustomerReservations />} />
          <Route path='/Customer-Details' element={<CustomerDetails />} />
          <Route path='/Customer-Payments' element={<CustomerPayments />} />
          <Route path='/Customer-Feedbacks' element={<CustomerFeedbacks />} />
          <Route path='/FoodItems' element={<FoodItems />} />
          <Route path='/Admin-Settings' element={<AdminSettings />} />
        </Routes>
        
      </BrowserRouter >

    </>
  )
};

export default App
