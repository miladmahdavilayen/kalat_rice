// Import necessary components and libraries
import React from 'react';
import { useLocation } from 'react-router-dom';

// Define your callback component
const PaymentCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Process the query parameters received from the third-party payment provider
    // const auth_code = queryParams.get('Authority ');
    const status = queryParams.get('Status');

    // Handle the status and perform actions based on it

    let message = '';

    if (status === 'OK') {
        message = 'Payment was successful! Thank you for your purchase. We will Contact you soon.';
    } else if (status === 'NOK') {
        message = 'Payment failed. Please try again or contact customer support.';
    } else {
        message = 'Payment status is unknown. Please check with customer support.';
    }

    return (
        <div>
            <h1>Payment Callback Page</h1>
            <p>{message}</p>
        </div>
    );
};

export default PaymentCallback;
