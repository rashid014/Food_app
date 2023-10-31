import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Invoice = ({ orderDetails, cart, totalAmount, isOrderCancelled }) => {
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      padding: 30,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    header: {
      fontSize: 16,
      marginBottom: 10,
      textDecoration: 'underline',
    },
    subheader: {
      fontSize: 14,
      marginTop: 10,
    },
    item: {
      fontSize: 12,
      margin: 5,
    },
    total: {
      fontSize: 14,
      marginTop: 20,
    },
    canceled: {
      fontSize: 16,
      color: 'red',
      marginTop: 20,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>
            {isOrderCancelled ? 'Cancelled Order' : 'Invoice'}
          </Text>
          {isOrderCancelled && (
            <Text style={styles.canceled}>This order has been cancelled.</Text>
          )}
          <Text style={styles.subheader}>Order Details:</Text>
          <Text style={styles.item}>Order ID: {orderDetails._id}</Text>
          <Text style={styles.item}>Customer Name: {orderDetails.customerName}</Text>
          <Text style={styles.item}>Contact Number: {orderDetails.contactNumber}</Text>
          <Text style={styles.item}>Delivery Address: {orderDetails.deliveryAddress}</Text>
          <Text style={styles.item}>
            Status: {orderDetails.isPresent ? 'Pending' : 'Cancelled'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Order Items:</Text>
          {cart.map((item) => (
            <Text style={styles.item} key={item._id}>
              {item.name} - Price: ${item.price} - Quantity: {item.quantity} - Total: ${item.price * item.quantity}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Order Summary:</Text>
          <Text style={styles.item}>Subtotal: ${totalAmount.subtotal}</Text>
          <Text style={styles.item}>Tax (5.00%): ${totalAmount.tax}</Text>
          <Text style={styles.item}>Delivery Charge: ${totalAmount.deliveryCharge}</Text>
          <Text style={styles.total}>Total: ${totalAmount.totalAmount}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
