import React, { useState} from 'react';
import InformationSubmitted from './InformationSubmitted';

import GetIp from './ip_config';


const PhoneVerification = (props) => {
  const random_code = props.randomCode
  const name = props.personName;
  const phone = props.phoneNumber;
  const address = props.address;
  const email = props.email;
  const amount = props.amount
  const str_random_code = random_code.toString()

  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [riceAmount, setRiceAmount] = useState(0)
  
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

  /// convert farsi amount to english if any
  
  function handleFormSubmit(event) {
    event.preventDefault();

    const errors = {};

    

    if (/^[\d\u06F0-\u06F9]+$/.test(amount)) { 
      setRiceAmount(toEnglish(amount));
  
    } else {
      // do something if the input value contains non-Farsi numeric characters
      setRiceAmount(amount);
    }
  

    const arabicVerifCode = toEnglish(verificationCode);

    // Validate verification code

    if (!verificationCode.trim()) {
      errors.verificationCode = "لطفا کد تأیید را وارد کنید.";
    } else if (!/^([\d\u06F0-\u06F9]{6})$/.test(verificationCode)) {
      errors.verificationCode = "کد باید ۶ رقمی باشد.";
    } else if (verificationCode !== str_random_code && arabicVerifCode !== str_random_code) {
      errors.verificationCode = "کد تاییدی اشتباه است.. دوباره سعی کنید.";
      setVerificationCode('');
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {

      // Verification submission logic here...
      setIsVerified(true);
      // axios.post('/get-verif-status', {name, phone , address, email, amount});
    }
  }

  return (
    <div>
        {isVerified ? (
          <div>
            <>
            <GetIp name={name} phone={phone} address={address} email={email} amount={amount}/>
            <InformationSubmitted personName={name} phone={phone} amount={riceAmount}
            email={email} address={address} 
            />
            </>
        </div>
    ) : (
      <form onSubmit={handleFormSubmit}>
      {errors.verificationCode && <div className="flash-message" dir="rtl">{errors.verificationCode}</div>}
      <div>
        <label htmlFor="verification-code" dir="rtl">لطفا کد تایید ارسال شده به {props.phoneNumber} را وارد کنید: </label>
        <input
          dir="rtl"
          type="text"
          id="verification-code"
          name="verification-code"
          value={verificationCode}
          onChange={(event) => setVerificationCode(event.target.value)}
        />
      </div>
      <button type="submit">ارسال</button>
    </form>
)}
    </div>



    
  );
};

export default PhoneVerification;
