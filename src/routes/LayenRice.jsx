
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';




const LayenRiceInfo = () =>{
   
    const [info] = useState("اینجا اطلاعات اضافه شود.");
   
    const navigate = useNavigate();
    
    return(<>
        <div >  
            <h5 dir='rtl'>
                {info}
            </h5>
            <h6 className="info" dir='rtl'>
              سایر اطلاعات در مورد برنج لاین در این قسمت بارگذاری خواهد شد.
            </h6>
        </div>
        <div> <button className="return_button" onClick={() => navigate(-1)}>بازگشت</button></div>
        </>
    );
};

export default LayenRiceInfo;