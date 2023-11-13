import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { PieChart, Pie, Tooltip as PieTooltip } from 'recharts';
import { LineChart, Line, XAxis as LineXAxis, YAxis as LineYAxis, Tooltip as LineTooltip } from 'recharts';
import AdminHeader from '../../AdminComponents/Header/AdminHeader';
import SideNavbar from '../SideNav/SideNavbar';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddCardIcon from '@mui/icons-material/AddCard';
import axiosInstance from '../../../utils/axiosInstance'
import './AdminDash.css';

const AdminHomePage = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [codPayments, setCodPayments] = useState(0);
  const [onlinePayments, setOnlinePayments] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch orders from the server
        const ordersResponse = await axiosInstance.get(
          '/api/restaurant/orders/admin'
        );

        // Filter orders with status "Delivered" or "Not Delivered"
        const filteredOrders = ordersResponse.data.orders;

        setOrders(filteredOrders);
        setTotalOrders(filteredOrders.length);

        // Calculate the number of delivered orders
        const delivered = filteredOrders.filter((order) => order.status === 'Delivered');
        setDeliveredOrders(delivered.length);

        // Calculate the number of COD and online payments
        const cod = filteredOrders.filter((order) => order.paymentType === 'COD');
        setCodPayments(cod.length);

        const online = filteredOrders.filter((order) => order.paymentType === 'ONLINE PAYMENT');
        setOnlinePayments(online.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Extract relevant data for charts
  const chartData = orders.map((order) => ({
    name: order.orderName, // Change to match your data structure
    commission: order.commission,
    totalAmount: order.totalAmount,
    remainingAmount: order.remainingAmount,
    tax: order.tax,
  }));

  return (
    <>
    
      <AdminHeader />

      <div className="admin-homepage">
        
        <SideNavbar />
        <h1 style={{ textAlign: 'center' }}>Admin Homepage</h1>
        <div className="order-stats mt-5">
  
  <div className="order-stat-card">
    <LocalMallIcon style={{ fontSize: '50px' }} />
    <p>Total Orders: {totalOrders}</p>
  </div>
  <div className="order-stat-card">
    <LocalShippingIcon style={{ fontSize: '50px' }}/>
    <p>Delivered Orders: {deliveredOrders}</p>
  </div>
  <div className="order-stat-card">
    <LocalAtmIcon style={{ fontSize: '50px' }} />
    <p>COD Payments: {codPayments}</p>
  </div>
  <div className="order-stat-card">
  <AddCardIcon style={{ fontSize: '50px' }} />
    <p>Online Payments: {onlinePayments}</p>
  </div>
</div>

        <div className="charts-container mt-5">
          <div className="chart-card">
            <h2>Commission</h2>
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="commission" fill="#8884d8" />
              <Tooltip content={<div>Custom Tooltip Content</div>} />
            </BarChart>
          </div>

          <div className="chart-card">
            <h2>Total Amount</h2>
            <PieChart width={300} height={300}>
              <Pie
                dataKey="totalAmount"
                nameKey="name"
                data={chartData}
                innerRadius={30}
                outerRadius={100}
                paddingAngle={5}
                cornerRadius={5}
                startAngle={-90}
                endAngle={180}
                cx={150}
                cy={150}
              />
              <PieTooltip />
            </PieChart>
          </div>

          <div className="chart-card">
            <h2>Restuarant Amount</h2>
            <LineChart width={500} height={300} data={chartData}>
              <Line type="monotone" dataKey="remainingAmount" stroke="#8884d8" />
              <LineXAxis dataKey="name" />
              <LineYAxis />
              <LineTooltip />
            </LineChart>
          </div>

          <div className="chart-card">
            <h2>Tax</h2>
            <LineChart width={500} height={300} data={chartData}>
              <Line type="monotone" dataKey="tax" stroke="#8884d8" />
              <LineXAxis dataKey="name" />
              <LineYAxis />
              <LineTooltip />
            </LineChart>
          </div>
        </div>
        
      </div>
  

     
      
    </>
  );
};

export default AdminHomePage;
