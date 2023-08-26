import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const auth_code = queryParams.get('Authority');
    const status = queryParams.get('Status');

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.post('/verify-payment', { status, auth_code });
                const parsedResponse = response.data;

                const final_status = parsedResponse['status'];
                if (status === 'OK'){
                    if (final_status === '100') {
                        setMessage('پرداخت شما با موفقیت انجام شد. به زودی با شما تماس خواهیم گرفت. با تشکرو برنج لاین!');
                    } else {
                        setMessage('پرداخت انجام نشد. لطفا مجددا تلاش کنید!');
                    }
                
                } else if (status === 'NOK') {
                    setMessage('پرداخت انجام نشد. لطفا مجددا تلاش کنید!');
                } else {
                    setMessage('وضعیت پرداخت نامعلوم.');
                }
            } catch (error) {
                console.error('Error making payment:', error);
                setMessage('خطا در انجام پرداخت!');
            }
        };

        fetchPaymentStatus();
    }, [auth_code, status]);

    return (
        <div>
            <h1>وضعیت پرداخت</h1>
            <h2 dir='rtl'>{message}</h2>
        </div>
    );
};

export default PaymentCallback;
