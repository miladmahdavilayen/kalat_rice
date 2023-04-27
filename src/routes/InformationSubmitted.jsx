import React, { useState } from 'react';
import axios from 'axios';



const InformationSubmitted = (props) => {
  const name = props.personName;
  const [amount, setAmount] = useState(props.amount);
  const phone = props.phone;

  const [option, setOption] = useState('deliver');
  const [payment, setPayment] = useState(null);
  const [delMethodPicked, setDeleMethodPicked] = useState(null);
  const [riceKgPrice] = useState(1500000);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [errors, setErrors] = useState({});
  

  
  
  const riceCost = parseFloat(amount) * riceKgPrice;
  const totalPrice = deliveryCost + riceCost ;
  const fRiceCost = (riceCost/10).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, '');
  const fTotalPrice = (totalPrice/10).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, '');
  const fDeliveryCost = (deliveryCost/10).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, '');
  const fAmount = (parseFloat(amount)).toLocaleString('fa');
  const [orderId] = useState(generateOrderId());

  const toEnglish = (farsiNum) =>{
    const engNum = farsiNum
  .toLocaleString("fa-IR")
  .replace(/۰/g, "0")
  .replace(/۱/g, "1")
  .replace(/۲/g, "2")
  .replace(/۳/g, "3")
  .replace(/۴/g, "4")
  .replace(/۵/g, "5")
  .replace(/۶/g, "6")
  .replace(/۷/g, "7")
  .replace(/۸/g, "8")
  .replace(/۹/g, "9")

  return engNum
  };

  function generateOrderId() {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    const newOrderId = `${timestamp}-${randomString}`;
    return newOrderId
  }


  const handleButtonClick = (event) => {
    event.preventDefault();
    setShowInput(true);
  };


  const handleInputChange = (event) =>{

    event.preventDefault();
    const errors = {};
    if (/^[\d\u06F0-\u06F9]+$/.test(event.target.value)) {
      setAmount(toEnglish(event.target.value));
      setErrors({});
    }else if (/^[0-9\b]+$/.test(event.target.value)){
      setAmount(parseInt(event.target.value));
      setErrors({});
    }else if (/^\s*$/.test(event.target.value)){
      setAmount('')
      setErrors({});
    } else{
      setAmount('');
      errors.amount = ".لطفا فقط یک عدد وارد کنید.";
      setErrors(errors);

    }
  };

 

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
    
    axios.post('/delivery-type', {name, option, orderId, phone, riceKgPrice, deliveryCost, totalPrice, amount});
  
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
          <h2 dir='rtl'>گزینه ارسال برنج برای شما انتخاب شد.<br/> لطفا پس از مشاهده خلاصه سفارش، دکمه پرداخت را کلیک کنید تا به سامانه پرداخت هدایت شوید. کد رهگیری پرداخت: </h2>
          <h5 dir='ltr'>{orderId}</h5>
          </div>
          <div>
              <h3  dir='rtl'> 
                <h4 className='dual-text'>صورتحساب:</h4>
                <h4 className='dual-text' >{fAmount} کیلوگرم برنج: <span> {fRiceCost} تومان</span> </h4>
                <h4 className='dual-text'>روش دریافت: <span>دلیوری به آدرس</span> </h4> 
                <h4 className='dual-text'>هزینه ارسال: <span>{fDeliveryCost} تومان</span> </h4> 
                <h4 className='dual-text'>مجموع مبلغ قابل پرداخت: <span>{fTotalPrice} تومان</span></h4>
              </h3>
              </div>
          <button type="submit">پرداخت</button>
        </form>
        </>
        ): (<>
          <form onSubmit={handlePayment}>
            <div>
            <h2 dir='rtl'>گزینه تحویل در محل توزیع برای شما انتخاب شد.<br/> لطفا پس از مشاهده خلاصه سفارش، دکمه پرداخت را کلیک کنید تا به سامانه پرداخت هدایت شوید. کد رهگیری پرداخت:</h2>
            <h5 dir='ltr'>{orderId}</h5>
            </div>
            <div>
            <h3  dir='rtl'> 
              <h4 className='dual-text'>صورتحساب:</h4>
              <h4 className='dual-text' >{fAmount} کیلوگرم برنج: <span> {fRiceCost} تومان</span> </h4>
              <h4 className='dual-text'>روش دریافت: <span>دریافت در محل توزیع  </span> </h4> 
              <h4 className='dual-text'>هزینه ارسال: <span>۰ تومان</span> </h4> 
              <h4 className='dual-text'>مجموع مبلغ قابل پرداخت: <span>{fTotalPrice} تومان</span></h4>
            </h3>
            </div>
            <button type="submit">پرداخت</button>
          </form>
          </>
          )):(<form onSubmit={handleDeliveryMethod}>
            <label for="del_method" dir='rtl'>مشتری عزیز، شماره همراه شما تایید گردید.<br/>لطفا نحوه دریافت برنج کلات را مشخص نمایید: </label>
            <select name="del_method" id="del_method" dir='rtl' className='select' onChange={handleOptions}>
              <option value="deliver" dir='rtl'>برنج به آدرس من ارسال شود.</option>
              <option value="pick-up" dir='rtl'>برنج را در محل توزیع تحویل خواهم گرفت.</option>
            </select>
            <label className='dual-text' for="edit_amount" dir='rtl'>  مقدار برنج درخواستی: <span dir='ltr'>{fAmount} کیلوگرم <button className='edit_amount' onClick={handleButtonClick}>تغییر</button></span> </label>
            {showInput && (
              <div>
                {errors.amount && <div className="flash-message" dir="rtl">{errors.amount}</div>}
                <input className='change-input' dir='rtl' type="amount_num"  onChange={handleInputChange} />
                
                {/* <button className='change-but' onClick={handleInputSubmit}>ثبت</button> */}
              </div>
            )}
            <button type="submit" className='submit_but' >صورتحساب</button>
          </form>)
      }
    </div>
    

  );
  };
  
  export default InformationSubmitted;
  
