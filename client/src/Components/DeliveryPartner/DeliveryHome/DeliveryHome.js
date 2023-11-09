import React from 'react';
import './DeliveryHome.css'; // Updated CSS file with unique class names
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import DeliveryHeader from '../DeliveryHeader/DeliveryHeader'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Order from './order.jpg'
const DeliveryPartnerHomepage = () => {
const {partnerId}=useParams();
const [submissions, setSubmissions] = useState([]);

useEffect(() => {
  // Fetch all submissions from the server when the component mounts
  axios.get('http://localhost:4000/api/admin/submissions').then((response) => {
    setSubmissions(response.data);
  });
}, []);
const partnerNames = submissions.find((submission) => submission._id === partnerId)?.name;


console.log("Partner Names: ", partnerNames);


  return (
    <>
     
    <DeliveryHeader  />
     
    <div className="container my-5" style={{ width: '1500px', height: '1200px' }}>
    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
  Welcome  {partnerNames ? partnerNames.toUpperCase() : ''}
</h1>


     
      <header className="text-center py-4">
        
       
     
      </header>

      <main className="row d-flex justify-content-center"> {/* Centering the content */}
        <div className="col-md-4 mb-4">
          <div className="card">
            
            <div className="card-body">
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
              <h2 className="card-title">Earnings Report</h2>
              <p className="card-text">Check your earnings and payment history.</p>
              <Link to={`/partnerpayment/${partnerId}`} className="btn btn-primary">
                Earnings
              </Link>
            </div>
          </div>
         
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
         
            <div className="card-body">
              <h2 className="card-title">Order history</h2>
              <p className="card-text">View your Order history here for any clarifications</p>
              <Link to={`/partnerhistory/${partnerId}`} className="btn btn-primary">
                Order History
              </Link>
            </div>
          </div>
         
        </div>
      </main>
      <div className="image-container" style={{ overflow: 'hidden' }}>
        {/* <img
          src="https://img.freepik.com/free-photo/food-delivery-man-with-boxes-with-food_1303-27723.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1699228800&semt=ais"
          alt="Image Description"
          style={{ width: '1400px', height: '1000px' }}
        /> */}
        <img src={Order}  style={{ width: '1400px', height: '800px' }}alt="Image Description" />
      </div>
      
    </div>
    <Container className="hey-my-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
            <AccessTimeIcon style={{ fontSize: '5rem' }} />
              <Card.Title className="mt-5">Flexible Work Schedules</Card.Title>
              <Card.Text>
              Our app offers delivery partners the flexibility to choose their work schedules. They can set their availability and accept orders during preferred hours. This feature allows delivery partners to balance work with personal commitments.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <AttachMoneyIcon style={{ fontSize: '4rem' }} />
              <Card.Title className="mt-5"> Earnings Transparency</Card.Title>
              <Card.Text>
              We provide full transparency regarding earnings and payments. Delivery partners can view their earnings, tips, and payment history within the app. Detailed breakdowns of each delivery's compensation are available, ensuring trust and clarity.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <ThumbUpAltIcon style={{ fontSize: '4rem' }} />
              <Card.Title className="mt-5"> Performance Metrics and Rewards</Card.Title>
              <Card.Text >
              Delivery partners can access performance metrics within the app, including delivery completion rates and customer ratings. High-performing partners may receive rewards or incentives as a recognition of their dedicational service.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

    </>
  );
};

export default DeliveryPartnerHomepage;
