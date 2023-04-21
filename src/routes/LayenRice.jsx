
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';




const LayenRiceInfo = () =>{
   
    const [info] = useState("اینجا اطلاعات اضافه شود.");
   
    const navigate = useNavigate();
    
    return(
        <div className='App'>  
            <h5 dir='rtl'>
                {info}
            </h5>
            <h6  dir='rtl'>
              سایر اطلاعات در مورد برنج لاین در این قسمت بارگذاری خواهد شد.
            </h6>
            <div><button onClick={() => navigate(-1)}> go back</button></div>
        </div>

    );
};

export default LayenRiceInfo;