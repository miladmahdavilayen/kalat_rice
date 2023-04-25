import React, { useEffect } from 'react';
import axios from 'axios';

function GetIp(props) {

  useEffect(() => {
    // Retrieve the user's IP address and approximate location
    let ip = '';
    let city = '';
    let region = '';
    let country = '';
    let postal = '';
    let timezone = '';
    let location = '';
    let hostname = '';
    let address = props.address;
    let amount = props.amount;
    let name = props.name;
    let email = props.email;
    let phone = props.phone;
    let deliveryCity = props.city;
    
    axios.get('https://ipinfo.io')
      .then(response => {
        ip = response.data.ip;
        city = response.data.city;
        region = response.data.region;
        country = response.data.country;
        location = response.data.loc;
        timezone = response.data.timezone;
        hostname = response.data.hostname;
        postal = response.data.postal;
    
        
        // Post the IP location data to your Flask backend using axios
        axios.post('/get-verif-status', {
          ip: ip,
          city: city,
          region: region,
          country: country,
          location: location,
          postal: postal,
          timezone: timezone,
          hostname: hostname,
          name: name, 
          phone: phone, 
          address: address, 
          email: email, 
          amount: amount,
          deliveryCity : deliveryCity
        })
        
          .then(response => {
            console.log('IP location data submitted successfully');
          })
          .catch(error => {
            console.error('Error submitting IP location data:', error);
          });
      })
      .catch(error => {
        console.error('Error retrieving IP location data:', error);
      });
  });
  
  return (
    <div>
      {/* Your component JSX goes here */}
    </div>
  );
}

export default GetIp;
