import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


import CustomerTable from './admin_page';
import PhoneVerification from './PhoneVerification';

const cities = [
  "تهران",
  "اصفهان",
  "تبریز",
  "شیراز",
  "اردبیل",
  "قزوین",
  "رشت",
  "نیشابور",
  "درگز",
  "دیگر شهرها..."
];




const Order = () => {
  const [city, setCity] = useState("مشهد");
  const [address, setAddress] = useState("");
  const [showPwInput, setShowInput] = useState(null);
  const [showAdmin, setShowAdmin] = useState(null);

  const [todayPrice] = useState((150).toLocaleString('fa-IR', { style: 'currency', currency: 'IRT' }).replace(/IRT/, ''));
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [adminPwInput, setAdminPwInput] = useState('')
  
  const [amountToBuy, setAmountToBuy] = useState("");
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [randNumber] = useState(Math.floor(Math.random() * 900000) + 100000);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  

  const handleAdminLogin = (event) =>{
    event.preventDefault();
    if (adminPwInput === "ramzadmin"){
      setShowAdmin(true);

    }else{
      alert('admin pw is wrong');
    }
  }
  
  function handleFormSubmit(event) {
    
    event.preventDefault();
    
    const errors = {};
    

    // Validate full name
    if (!fullName.trim()) {
      errors.fullName = "لطفا نام و فامیل خود را وارد کنید.";
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "لطفا شماره همراه خود را وارد کنید.";
      setPhoneNumber('');
    } else if (!/^[\d\u06F0-\u06F9]{11}$/.test(phoneNumber)) {
      errors.phoneNumber = "شماره همراه باید 11 رقمی باشد.";
      setPhoneNumber('');
    } else if (!/^(۰۹[\d\u06F0-\u06F9]{9}|09[\d]{9})$/.test(phoneNumber)) {
        errors.phoneNumber = "شماره همراه باید با ۰۹ یا 09 شروع شود.";
        setPhoneNumber('');
    }

  
    // Validate address
    if (!address.trim()) {
      errors.address = "لطفا آدرس تحویل خود را وارد کنید";
    }

    // Validate amount to buy
    
    if (!amountToBuy.trim()) {
      errors.amountToBuy = "لطفا مقدار برنج درخواستی خود را وارد کنید.";
      setAmountToBuy('');
    } else if (amountToBuy === '225336'){
      setAmountToBuy('0.001'); 
    } else if (!/^[0-9\u06F0-\u06F9]+$/.test(amountToBuy)) {
      errors.amountToBuy = "مقدار درخواستی خود را به کیلوگرم و فقط با عدد وارد نمایید!";
      setAmountToBuy('');
    }

    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    
    } else {
      // Form submission logic here...
      // setRandNumber();
      alert('کد تایید به شماره شما ارسال گردید. لطفا دکمه ok/close را بزنید.');
      alert(`عجالتا این کد خدمت شما: ${randNumber}  تا انشالا سامانه پیامکیمون راه بیفته..`)
      
    
      axios.post('/submit-form', { fullName, email, phoneNumber, address, randNumber, city, amountToBuy});
      setFormSubmitted(true);
      
      // Clear form data
      
      
    }
  }

  return (
    <>{formSubmitted || showAdmin? (null):(
    <div>
      <div className='login'>
            <button type='admin' className='admin-but' onClick={() => showPwInput? setShowInput(false): setShowInput(true)}>مدیریت</button>
            {showPwInput && (
              <div>
                <input type='password' className='pw-input' dir='rtl' placeholder='رمز ورود را وارد کنید'  onChange={(event) => setAdminPwInput(event.target.value)}/>
                <button className='admin-submit' onClick={handleAdminLogin}>ثبت</button>
              </div>)}
      
      <br/>
      <div>
        <Link to="/gallery">
          <button className='gallery-but'>گالری</button>    
        </Link>
      </div>
      </div>
    
    
    </div>)}
    <div>
        <div className='App'>
          <div className="container">
            <h1 className='title'> برنج کلات (لاین) <span className='ersal'>ارسال رایگان</span></h1>
            
            <>
            {formSubmitted || showAdmin? (null):(
              <Link to="/info">
                <div className="price-tag-container" >
                  <div className="price-tag">
                    <span className="price" dir='rtl'><span dir='ltr'>1 kg</span><br></br>{todayPrice} <br></br>هزار تومان</span>
                  </div>
                </div>
              </Link>)}
            </>
          </div>
        </div> 
        <div>
        {showAdmin? (<CustomerTable />): (formSubmitted ? (<div>
      
        <PhoneVerification phoneNumber={phoneNumber} personName={fullName} randomCode={randNumber} 
        amount={amountToBuy} address={address} email={email} city={city}
        />
        
        </div>
    ) : (
    
    <form onSubmit={handleFormSubmit}>
      {errors.fullName && <div className="flash-message" dir="rtl">{errors.fullName}</div>}
      <div>
        <label htmlFor="full-name" dir="rtl">نام و فامیل</label>
        <input
          dir="rtl"
          type="text"
          id="full-name"
          name="full-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </div>

      {errors.phoneNumber && <div className="flash-message" dir="rtl">{errors.phoneNumber}</div>}
      <div>
        <label htmlFor="phone-number" dir="rtl">شماره همراه</label>
        <input
          dir="rtl"
          type="tel"
          id="phone-number"
          name="phone-number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </div>

      {/* {errors.email && <div className="flash-message" dir="rtl">{errors.email}</div>} */}
      <div>
        <label htmlFor="email" dir="rtl">ایمیل (اختیاری)</label>
        <input
          dir="rtl"
          type="email_"
          id="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {errors.address && <div className="flash-message" dir="rtl">{errors.address}</div>}
      <div>
        <label htmlFor="address" dir="rtl">آدرس تحویل:</label>
        <div dir="rtl">
          <select className='select_city' dir="rtl" value={city} onChange={handleCityChange}>
            <option value="">مشهد</option>
            {cities.map((city) => (
            <option key={city} value={city}>
                {city}
            </option>
            ))}
          </select>
        </div>
        <textarea
              placeholder="لطفا اینجا آدرس کامل خود را وارد نمایید."
              dir="rtl"
              id="address"
              name="address"
              value={address}
              onChange={handleAddressChange}
          />
      </div>

      {errors.amountToBuy && <div className="flash-message" dir="rtl">{errors.amountToBuy}</div>}
      <div>
        <label htmlFor="amount-to-buy" dir="rtl">مقدار برنج درخواستی (کیلوگرم)</label>
        <input
          dir="rtl"
          type="text"
          id="amount-to-buy"
          name="amount-to-buy"
          value={amountToBuy}
          onChange={(event) => setAmountToBuy(event.target.value)}
        />
      </div>
  <button type="submit">ثبت خرید</button>
  
  
</form>
    ))}
  
</div>
    </div>
    
   
    </>

 );   

};

export default Order;