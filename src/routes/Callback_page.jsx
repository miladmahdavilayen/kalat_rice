// Import necessary components and libraries
import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Define your callback component
const PaymentCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Process the query parameters received from the third-party payment provider
    const auth_code = queryParams.get('Authority');
    const status = queryParams.get('Status');

    try {
        const response = axios.post('/verify-payment', { status, auth_code});
        const parsedResponse = JSON.parse(response.data);
        alert(parsedResponse.Status)
        alert(parsedResponse.RefID)
        // wait for 1 seconds
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
    } catch (error) {
        console.error('Error making payment:', error);
    }


    // Handle the status and perform actions based on it

    let message = '';

    if (status === 'OK') {
        message = 'پرداخت شما با موفقیت انجام شد. به زودی با شما تماس خواهیم گرفت. با تشکرو برنج لاین!';
    } else if (status === 'NOK') {
        message = 'پرداخت انجام نشد. لطفا مجددا تلاش کنید!';
    } else {
        message = 'وضعیت پرداخت نامعلوم.';
    }

    return (
        <div>
            <h1>وضعیت پرداخت</h1>
            <h2 dir='ltr'>{message}</h2>
        </div>
    );
};

export default PaymentCallback;
