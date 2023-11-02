import React from 'react';
import './DeliveryHome.css'; // Updated CSS file with unique class names
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useParams } from 'react-router-dom';
import DeliveryHeader from '../DeliveryHeader/DeliveryHeader'
import { Link } from 'react-router-dom';
const DeliveryPartnerHomepage = () => {
const {partnerId}=useParams();

  return (
    <div className="container my-5">
      <DeliveryHeader />
      <header className="text-center py-4">
        <h1>Delivery Partner App</h1>
        <nav>
          <ul className="nav justify-content-center">
            <li className="nav-item">
              <a className="nav-link" href="/">fHome</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/orders">Orders</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/earnings">Earnings</a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="fas fa-shopping-bag fa-3x mb-3"></i>
              <h2 className="card-title">Accept Orders</h2>
              <p className="card-text">View and accept incoming delivery orders.</p>
              <Link to={`/partnerordermanagement/${partnerId}`} className="btn btn-primary">
                Orders
              </Link>
          
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="fas fa-history fa-3x mb-3"></i>
              <h2 className="card-title">Delivery History</h2>
              <p className="card-text">Track your order delivery history.</p>

              <button className="btn btn-primary">View History</button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="fas fa-money-bill fa-3x mb-3"></i>
              <h2 className="card-title">Earnings Report</h2>
              <p className="card-text">Check your earnings and payment history.</p>
                 <Link to={`/partnerpayment/${partnerId}`} className="btn btn-primary">
               Earnings
              </Link>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default DeliveryPartnerHomepage;
