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
import { CartProvider } from './Components/Hooks/useCart'
import PaymentForm from './Components/PaymentForm'
import FoodItemDetails from './Components/FoodItemDetails'


function App() {
  return (
    <>
      <BrowserRouter>
        <CartProvider>
          <DarkModeProvider>
            <Routes>
              {/* Admin Routes */}
              {/* Customer Routes */}
              <Route path={'/'} element={<Navbar />}>
                <Route path={'/'} element={<DisplayingFoodItems />} />
                <Route path={'/Login'} element={<CustomerLogin />} />
                <Route path={'/Signup'} element={<CustomerSignup />} />
                <Route path={'/Reservations'} element={<Reservations />} />
                <Route path={'/Feedbacks'} element={<Feedback />} />
                <Route path={'/Complaints'} element={<Complaints />} />
                <Route path={'/Store-Locator'} element={<StoreLocator />} />
                <Route path={'/Track-Order'} element={<TrackOrder />} />
                <Route path={'/PrivacyPolicy'} element={<PrivacyPolicy />} />
                <Route path={'/My-Home'} element={<Home />} />
                <Route path={'/cart'} element={<Cart />} />
                <Route path={'/FoodMenu'} element={<FoodMenu />} />
                <Route path={'/Payment'} element={<PaymentForm/>} />
                <Route path={'/FoodItemDetails/:id'} element={<FoodItemDetails/>} />
              </Route>

              <Route path={'/adminLogin'} element={<AdminLogin />} />
              <Route path={'/adminPortal'} element={<AdminPortal />}> </Route>
              <Route path={'Customer-Orders'} element={<CustomerOrders />} />
              <Route path={'Customer-Reservations'} element={<CustomerReservations />} />
              <Route path={'Customer-Details'} element={<CustomerDetails />} />
              <Route path={'Customer-Payments'} element={<CustomerPayments />} />
              <Route path={'Customer-Feedbacks'} element={<CustomerFeedbacks />} />
              <Route path={'FoodItems'} element={<FoodItems />} />
              <Route path={'Admin-Settings'} element={<AdminSettings />} />


            </Routes>
          </DarkModeProvider>
        </CartProvider>
      </BrowserRouter>
      {//admin side routes 
      }


    </>
  )
}


export default App;

