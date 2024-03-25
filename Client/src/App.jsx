import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import './FoodLoader.css'
import './ErrorPage.css'
import Navbar from './Components/NavBar'
import CustomerLogin from './Components/Authentication/CustomerLogin'
import CustomerSignup from './Components/Authentication/CustomerSignup'
import Reservations from './Components/Drawer/Reservations'
import Feedback from './Components/Drawer/Feedback'
import Complaints from './Components/Drawer/Complaints'
import DisplayingFoodItems from './Components/MainUI/DisplayingFoodItems'
import { DarkModeProvider } from './Components/Hooks/DarkModeContext'
import TrackOrder from './Components/Drawer/TrackOrder'
import StoreLocator from './Components/Drawer/StoreLocator'
import PrivacyPolicy from './Components/Drawer/PrivacyPolicy'
import Cart from './Components/MainUI/Cart'
import FoodMenu from './Components/MainUI/FoodMenu'
import Home from './Components/DashBoard/Home'
import { CartProvider } from './Components/Hooks/useCart'
import PaymentForm from './Components/MainUI/PaymentForm'
import FoodItemDetails from './Components/MainUI/FoodItemDetails'
import ErrorPage from './Components/ErrorHandlings/ErrorPage'



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
              </Route>
              <Route path="*" element={<ErrorPage />} />
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

