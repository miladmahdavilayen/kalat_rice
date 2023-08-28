import React, { useState, useEffect} from 'react';
import InformationSubmitted from './InformationSubmitted';
import GetIp from './ip_config';

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

const toFarsi = (englishNum) =>{
  const fNum = englishNum
.toLocaleString("fa-IR")
.replace("0", /۰/g)
.replace("1", /۱/g)
.replace("2", /۲/g)
.replace("3", /۳/g)
.replace("4", /۴/g)
.replace("5", /۵/g)
.replace("6", /۶/g)
.replace("7", /۷/g)
.replace("8", /۸/g)
.replace("9", /۹/g)
return fNum
};



const PhoneVerification = (props) => {
  
  const [timeColor, setTimeColor] = useState('blue');
  const random_code = props.randomCode
  const name = props.personName;
  const phone = props.phoneNumber;
  const address = props.address;
  const email = props.email;
  const amount = props.amount
  const city = props.city
  const str_random_code = random_code.toString()
  
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [riceAmount, setRiceAmount] = useState(0)
  
  const [countdown, setCountdown] = useState(150);
  const [stopVerifProcess, setStopVerifProcess] = useState(null);
  const [farsiCountDown, setFarsiCountDown] = useState(toFarsi(countdown))
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
        setFarsiCountDown(toFarsi(countdown));
      }, 1000);
      if (countdown === 15) {
        setTimeColor('red');
      }
      if (countdown === 0) {
        stopProcess();
      }
      if (isVerified === true) {
        clearInterval(intervalId);
      }
      return () => clearInterval(intervalId);
    }, [countdown, isVerified]);
  
    function stopProcess() {
      // code to stop the process
      setStopVerifProcess(true);
    }
  

  
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
      
    }
  }

  return (
    <div>
        {stopVerifProcess? (<h1 dir='rtl' style={{'maxWidth': 600, 'fontFamily': 'Vazir', 'fontSize': 30}}>زمان شما پایان یافته است. لطفا مجددا جهت ثبت سفارش خود اقدام نمایید! با تشکر.. <br/><button className='admin-but'onClick={() => window.location.href = '/'}>بازگشت به ثبت سفارش</button></h1>): (
        isVerified ? (
          <div>
            <>
            <GetIp name={name} phone={phone} address={address} email={email} amount={amount} city={city}/>
            <InformationSubmitted personName={name} phone={phone} amount={riceAmount} email={email} address={address} city={city} />
            </>
        </div>
    ) : (
      <form onSubmit={handleFormSubmit}>
      {errors.verificationCode && <div className="flash-message" dir="rtl">{errors.verificationCode}</div>}
      <label className='dual-text' htmlFor="verification-code" dir="rtl">لطفا کد تایید ارسال شده به {props.phoneNumber} را وارد کنید: </label>
      <div>
        <div>
          <input
            dir="rtl"
            type="text"
            id="verification-code"
            name="verification-code"
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value)}
          />
          <div dir="rtl">زمان باقی مانده: <span style={{'color': timeColor}}>{farsiCountDown}</span> ثانیه</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><button type="submit">ثبت</button><span dir='rtl'><button className='edit_amount' onClick={() => window.location.reload()}> بازگشت به اول</button></span></div>
      </div>
      
    </form>
    
))
}
    </div>



    
  );
};

export default PhoneVerification;
