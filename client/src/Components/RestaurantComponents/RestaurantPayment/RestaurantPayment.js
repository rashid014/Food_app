import React, { Component } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

class PaymentHistoryPage extends Component {
  constructor() {
    super();
    this.state = {
      payments: [
        { id: 1, orderName: 'Burger Combo', amount: 12.0 },
        { id: 2, orderName: 'Pizza Meal', amount: 18.0 },
        { id: 3, orderName: 'Sushi Platter', amount: 22.0 },
        // Add more payments here
      ],
    };
  }

  render() {
    return (
      <div className="payment-history-page">
        <h1>Payment History</h1>
        <Grid container spacing={2}>
          {this.state.payments.map((payment) => (
            <Grid key={payment.id} item xs={12} md={4}>
              <Card className="payment-card">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Order: {payment.orderName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Amount: ${payment.amount.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default PaymentHistoryPage;
