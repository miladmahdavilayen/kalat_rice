import React, { useState } from 'react';
import axios from 'axios';



const InformationSubmitted = (props) => {
  const name = props.personName;
  const amount = props.amount;
  const phone = props.phone;

  const [option, setOption] = useState('deliver');
  const [payment, setPayment] = useState(null);
  const [delMethodPicked, setDeleMethodPicked] = useState(null);
  const [riceKgPrice] = useState(1500000);
  const [deliveryCost, setDeliveryCost] = useState(0);
  
  
  
  
  const riceCost = parseFloat(amount) * riceKgPrice;
  const totalPrice = deliveryCost + riceCost ;
  const fRiceCost = (riceCost/10).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, 'تومان');
  const fTotalPrice = (totalPrice/10).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, 'تومان');
  const fDeliveryCost = (deliveryCost/10).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, 'تومان');
  const [orderId] = useState(generateOrderId());

  function generateOrderId() {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    const newOrderId = `${timestamp}-${randomString}`;
    return newOrderId
  }


 




  const handlePayment = (event) => {
    event.preventDefault();
    setPayment(true);
    
  }

  const handleOptions = (event) => {
    event.preventDefault();
    // alert(event.target.value);
    setOption(event.target.value);
    axios.post('/delivery-option', {name, option});
    
  };

  const handleDeliveryMethod = (event) =>{
    event.preventDefault(); 
    setDeleMethodPicked(true);
    if (option === 'pick-up'){
      setDeliveryCost(0);
    }else{
      
      if (parseFloat(amount) > 100){
        const extraLoad = parseFloat(amount) - 100;
        setDeliveryCost(2500000 + extraLoad * (50000));
      }else{
        setDeliveryCost(2500000);
      } 
    }
    
    axios.post('/delivery-type', {name, option, orderId, phone, riceKgPrice, deliveryCost, totalPrice});
  
    };

  
  
  return (
    <div>
      { payment? (
      <>
      <h2 dir='rtl'>در حال بارگذاری صفحه پرداخت...</h2>
      
      </>
      ):

      delMethodPicked? (option === 'deliver'? (
        <>
        <form onSubmit={handlePayment}>
          <div>
          <h2 dir='rtl'>گزینه ارسال برنج برای شما انتخاب شد. لطفا پس از مشاهده خلاصه سفارش، دکمه پرداخت را کلیک کنید تا به سامانه پرداخت هدایت شوید. کد رهگیری پرداخت: </h2>
          <h5 dir='ltr'>{orderId}</h5>
          </div>
          <div>
              <h3  dir='rtl'> 
                <h4 className='dual-text'>صورتحساب:</h4>
                <h4 className='dual-text' >{amount} کیلوگرم برنج: <span> {fRiceCost}</span> </h4>
                <h4 className='dual-text'>هزینه ارسال: <span>{fDeliveryCost}</span> </h4> 
                <h4 className='dual-text'>مجموع مبلغ قابل پرداخت: <span>{fTotalPrice}</span></h4>
              </h3>
              </div>
          <button type="submit">پرداخت</button>
        </form>
        </>
        ): (<>
          <form onSubmit={handlePayment}>
            <div>
            <h2 dir='rtl'>گزینه تحویل در محل توزیع برای شما انتخاب شد. لطفا پس از مشاهده خلاصه سفارش، دکمه پرداخت را کلیک کنید تا به سامانه پرداخت هدایت شوید. کد رهگیری پرداخت:</h2>
            <h5 dir='ltr'>{orderId}</h5>
            </div>
            <div>
            <h3  dir='rtl'> 
              <h4 className='dual-text'>صورتحساب:</h4>
              <h4 className='dual-text' >{amount} کیلوگرم برنج: <span> {fRiceCost}</span> </h4>
              <h4 className='dual-text'>هزینه ارسال: <span>رایگان</span> </h4> 
              <h4 className='dual-text'>مجموع مبلغ قابل پرداخت: <span>{fTotalPrice}</span></h4>
            </h3>
            </div>
            <button type="submit">پرداخت</button>
          </form>
          </>
          )):(<form onSubmit={handleDeliveryMethod}>
            <label for="del_method" dir='rtl'>لطفا نحوه دریافت برنج کلات را مشخص نمایید: </label>
            <select name="del_method" id="del_method" dir='rtl' className='select' onChange={handleOptions}>
              <option value="deliver" dir='rtl'>برنج به آدرس من ارسال شود.</option>
              <option value="pick-up" dir='rtl'>برنج را در محل توزیع تحویل خواهم گرفت.</option>
            </select>
            <button type="submit" className='submit_but'>ثبت خرید</button>
          </form>)
      }
    </div>
    

  );
  };
  
  export default InformationSubmitted;
  
