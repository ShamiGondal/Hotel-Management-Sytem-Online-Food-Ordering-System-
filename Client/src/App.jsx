import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/NavBar'
import CustomerLogin from './Components/CustomerLogin'
import CustomerSignup from './Components/CustomerSignup'
import Reservations from './Components/Reservations'
import Feedback from './Components/Feedback'
import Complaints from './Components/Complaints'
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
import ErrorPage from './Components/ErrorPage'


function App() {
  return (
    <>
      <BrowserRouter>
        <CartProvider>
          <DarkModeProvider>
            <Routes>
              {/* Admin Routes */}
              {/* Customer Routes */}
              <Route path="/" element={<Navbar />}>
                <Route path="/" element={<DisplayingFoodItems />} />
                <Route path="/Login" element={<CustomerLogin />} />
                <Route path="/Signup" element={<CustomerSignup />} />
                <Route path="/Reservations" element={<Reservations />} />
                <Route path="/Feedbacks" element={<Feedback />} />
                <Route path="/Complaints" element={<Complaints />} />
                <Route path="/Store-Locator" element={<StoreLocator />} />
                <Route path="/Track-Order" element={<TrackOrder />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/My-Home" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/FoodMenu" element={<FoodMenu />} />
                <Route path="/Payment" element={<PaymentForm />} />
                <Route path="/FoodItemDetails/:id" element={<FoodItemDetails />} />
                {/* Error route (should be at the end) */}
              </Route>
              <Route component={ErrorPage} />
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

