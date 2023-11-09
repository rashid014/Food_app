import React,{useEffect,useState} from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import AdminDash from './Components/AdminComponents/Dashboard/AdminDash'
import AdminaddUsers from './Components/AdminComponents/Users/AdminaddUsers'
import UpdateUser from './Components/AdminComponents/Users/UpdateUser'
import Usermanagement from './Components/AdminComponents/Users/Usermanagement'
import AdminPage1 from './Pages/AdminPages/AdminPage1'
import Home from './Pages/UserPages/HomePage'
import Login from './Pages/UserPages/LoginPage'
import ProfilePage from './Pages/UserPages/ProfilePage'
import Signup from './Pages/UserPages/SignupPage'
import RestaurantSignup from './Components/RestaurantComponents/RestaurantSignup/RestaurantSignup'
import RestaurantLogin from './Components/RestaurantComponents/RestaurantLogin/RestaurantLogin'
import RestaurantHome from './Components/RestaurantComponents/RestaurantHome/RestaurantHome'
import Cookies from 'js-cookie'
import Kyc from './Components/RestaurantComponents/kyc/kyc'
import KycAuthentication from './Components/AdminComponents/kycAuthentication/kycAuthentication'
import RedirectWait from './Components/RestaurantComponents/RedirectPage/RedirectWait'
import RestaurantMenuManagement from './Components/RestaurantComponents/RestaurantMenuManagement/RestaurantMenuManagement'
import RestaurantMenuEdit from './Components/RestaurantComponents/RestaurantMenuEdit/RestaurantMenuEdit'
import RestaurantManagement from './Components/AdminComponents/Restaurant/RestaurantManagement'
import DeliveryPartner from './Components/DeliveryPartner/DeliveryPartner'
import RestaurantPayment from './Components/RestaurantComponents/RestaurantPayment/RestaurantPayment'
import RestaurantList from './Components/RestaurantComponents/List/RestaurantList'
import ItemList from './Components/RestaurantComponents/List/ItemList'
import CategoryList from './Components/RestaurantComponents/List/CategoryList'
import CartPage from './Components/UserComponets/Cart/Cart'
import PlaceOrderPage from './Components/UserComponets/PlaceOrderPage/PlaceOrderPage'
import RestaurantDetails from './Components/UserComponets/Home/RestaurantDetails'
import PartnerApproval from './Components/AdminComponents/PartnerApproval/PartnerApproval'
import DeliveryLogin from './Components/DeliveryPartner/DeliveryLogin/DeliveryLogin'
import DeliveryPartnerHomepage from './Components/DeliveryPartner/DeliveryHome/DeliveryHome'
import ForgotPassword from './Components/UserComponets/ForgotPassword/ForgotPassword'
import RazorPay from './Components/UserComponets/RazorPay/RazorPay'
import OrderSuccessPage from './Components/UserComponets/PlaceOrderPage/PlaceOrderSucessPage'
import OrderManagement from './Components/RestaurantComponents/OrderManagement/OrderManagement'
import PartnerOrderManagement from './Components/DeliveryPartner/PartnerOrderManagement/PartnerOrderManagement'
import OrderView from './Components/UserComponets/OrderView/OrderView'
import AdminPayment from './Components/AdminComponents/AdminPayment/AdminPayment'
import DeliveryPayment from './Components/DeliveryPartner/DeliveryPayment/DeliveryPayment'
import './App.css'
import Coupon from './Components/AdminComponents/Coupon/Coupon'

import RestaurantCoupon from './Components/RestaurantComponents/RestaurantCoupon/RestaurantCoupon'
import History from './Components/DeliveryPartner/History/History'
function App() {
  const[accessToken,setAccessToken]=useState("")
  useEffect(
    ()=>{
      const token=Cookies.get("jwtsecret")
      console.log(token,"TOKEN######");
      setAccessToken(token)
    }
  )

  
  return (
    
       <Router>
    <Routes>
    <Route exact path="/login"  element={<Login/>}/>
     <Route  path="/"  element={<Home/>}/>
     <Route  path="/Profile" element={<ProfilePage/>} />
    <Route  path="/signup"  element={<Signup/>}/>

    <Route path='/admin' element={<AdminPage1/>} />

    <Route path='/adminHome' element={<AdminDash/>} />
    <Route path='/users' element={<Usermanagement/>} />

    <Route path='/adminAddUser' element={<AdminaddUsers/>}/>
    <Route path='/updateUser/:id' element={<UpdateUser/>} />

    //Restaurant Pages
    <Route path='/restaurantsignup' element={<RestaurantSignup/>} />
    <Route path='/restaurantlogin' element={<RestaurantLogin/>} />
    <Route path="/kyc/:restaurantId" element={<Kyc />} />
    <Route path='/redirectwait/:restaurantId' element={<RedirectWait/>} />
    <Route path='/restaurantmenu/:restaurantId' element={<RestaurantMenuManagement/>} />
    <Route path='/restaurantedit' element={<RestaurantMenuEdit/>} />
    <Route path="/restaurantHome/:restaurantId" element={<RestaurantHome />} />
    <Route path="/restaurant-management" element={<RestaurantManagement />} />
    <Route path="/partnersignup" element={<DeliveryPartner />} />
    <Route path="/restaurant/:restaurantId" element={<RestaurantDetails />} />
    <Route path="/itemlist" element={<ItemList />} />
    <Route path="/categorylist/:categoryId" element={<CategoryList/>} />
    <Route path="/cart" element={<CartPage/>} />
    <Route path="/placeorder" element={<PlaceOrderPage/>} />
    <Route path="/partnerlogin" element={<DeliveryLogin/>} />
    <Route path="/partnerhome/:partnerId" element={<DeliveryPartnerHomepage/>} />
    <Route path="/forgotpassword" element={<ForgotPassword/>} />
    <Route path="/ordersuccess/:orderId" element={<OrderSuccessPage/>} />
    <Route path="/online" element={<RazorPay/>} />
    <Route path="/ordermanagement/:restaurantId" element={<OrderManagement/>} />
    <Route path="/partnerordermanagement/:partnerId" element={<PartnerOrderManagement/>} />
    <Route path="/userorderview" element={<OrderView />} />
    <Route path="/restaurantpayment/:restaurantId" element={<RestaurantPayment/>} />
    <Route path="/partnerpayment/:partnerId" element={<DeliveryPayment/>} />
    admin pages 
    <Route path="/admin-approval" element ={<KycAuthentication />} />
    <Route path="/partner-approval" element ={<PartnerApproval/>} />
    <Route path="/admin-payment" element ={<AdminPayment />} />
    <Route path="/restaurantcoupon/:restaurantId" element ={<RestaurantCoupon />} />
   
    <Route path="/coupon" element ={<Coupon />} />
    <Route path="/partnerhistory/:partnerId" element ={<History />} />
    
    {
      accessToken && <Route path='/restaurantedit' element={<RestaurantMenuEdit/>} />
    }
    
    
    </Routes>
   </Router>
 
  
  )
}

export default App