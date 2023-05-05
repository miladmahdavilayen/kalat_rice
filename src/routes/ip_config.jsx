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

    // milad local ip address
    axios.get("https://ipinfo.io/35.146.15.101/json?token=401cc3d28ca774")
      .then(response => {
        ip = response.data.ip;
        city = response.data.city;
        region = response.data.region;
        country = response.data.country;
        location = response.data.loc;
        timezone = response.data.timezone;
        hostname = response.data.hostname;
        postal = response.data.postal;

        axios.post('/get-verif-status', {
          ip: ip,
          city: city,
          region: region,
          country: country,
          location: location,
          postal: postal,
          timezone: timezone,
          hostname: hostname,
          name: props.name,
          phone: props.phone,
          address: props.address,
          email: props.email,
          amount: props.amount,
          deliveryCity: props.city
        });
      })
      .catch(error => {
        console.error('Error retrieving IP location data:', error);
        axios.post('/get-verif-status', {
          ip: ip,
          city: city,
          region: region,
          country: country,
          location: location,
          postal: postal,
          timezone: timezone,
          hostname: hostname,
          name: props.name,
          phone: props.phone,
          address: props.address,
          email: props.email,
          amount: props.amount,
          deliveryCity: props.city
        })
        .then(response => {
          console.log('Data submitted successfully');
        })
        .catch(error => {
          console.error('Error submitting data:', error);
        });
      
      });

    
  });

  return (
    <div>
      {/* Your component JSX goes here */}
    </div>
  );
}

export default GetIp;
