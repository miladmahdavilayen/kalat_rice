import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const successMessage = 'پرداخت شما با موفقیت انجام شد. به زودی با شما تماس خواهیم گرفت. با تشکرو برنج لاین!';
    const failureMessage = 'پرداخت انجام نشد. لطفا مجددا تلاش کنید!';
    const unknownMessage = 'وضعیت پرداخت نامعلوم.';

    const auth_code = queryParams.get('Authority');
    const status = queryParams.get('Status');

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.post('/verify-payment', { status, auth_code });
                const parsedResponse = JSON.parse(response.data);
                const final_status = parsedResponse['status'];
                alert(final_status)


                switch (status) {
                    case 'OK':
                        setMessage(final_status === '100' ? successMessage : failureMessage);
                        break;
                    case 'NOK':
                        setMessage(failureMessage);
                        break;
                    default:
                        setMessage(unknownMessage);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Network error making payment:', error);
                    setMessage('خطا در ارتباط با سرور.');
                } else {
                    console.error('Error making payment:', error);
                    setMessage('خطا در انجام پرداخت: ' + error.message);
                }
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
