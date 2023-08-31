import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const successMessage = 'پرداخت شما با موفقیت انجام شد. به زودی با شما تماس خواهیم گرفت. با تشکر.. برنج لاین!';
    const failureMessage = 'پرداخت انجام نشد. لطفا مجددا تلاش کنید!';

    const auth_code = queryParams.get('Authority');
    const status = queryParams.get('Status');

    const [message, setMessage] = useState('');
    const [finalStatus, setFinalStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState('');
    const [riceCost, setRiceCost] = useState('');
    const [deliveryType, setDeliveryType] = useState('');
    const [delCost, setDelCost] = useState('');
    const [finalCharge, setFinalCharge] = useState('');
    const [name, setName] = useState('');

    const toFarsiPrice = (price) => {
        return (price/10).toLocaleString('fa-IR').replace(/IRT/, '').replace(/٬/g, ',');
      };

    const toFarsiNum = (number) => {
    return parseFloat(number).toLocaleString('fa');
    };
    

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.post('/verify-payment', { status, auth_code });
                const parsedResponse = response.data;
                setName(parsedResponse.name);
                setFinalStatus(parsedResponse.final_status);
                setOrderId(parsedResponse.order_id);
                setAmount(toFarsiNum(parsedResponse.amount));
                setRiceCost(toFarsiPrice(parsedResponse.rice_cost));
                setDeliveryType(parsedResponse.delivery);
                setDelCost(toFarsiPrice(parsedResponse.del_cost));
                setFinalCharge(toFarsiPrice(parsedResponse.charge));

                switch (finalStatus) {
                    case 100:
                        setMessage(successMessage);
                        break;
                    default:
                        setMessage(failureMessage);
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
    }, [auth_code, status, finalStatus]);

    return (
        <div>
            <h2 dir='rtl'>{message}</h2>
            <h1>رسید خرید</h1>
            <h5 dir='ltr'>{orderId} کد رهگیری</h5>
           <form>
            <div dir='rtl'>
                <h4 style={{ textAlign: 'center' }}>رسید خرید</h4>
                <h4 className='dual-text'>نام خریدار: <span>{name}</span></h4>
                <h4 className='dual-text'>{amount} کیلوگرم برنج: <span>{riceCost} تومان</span></h4>
                <h4 className='dual-text'>روش دریافت: <span>{deliveryType === 'deliver' ? 'ارسال به آدرس' : 'دریافت در محل توزیع'}</span></h4>
                <h4 className='dual-text'>هزینه ارسال: <span>{delCost} تومان</span></h4>
                <h4 className='dual-text'>مجموع مبلغ قابل پرداخت: <span>{finalCharge} تومان</span></h4>
            </div>
            </form>
        </div>
    );
};

export default PaymentCallback;
