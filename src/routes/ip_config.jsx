import React, { useEffect } from 'react';
import axios from 'axios';

function GetIp() {
  useEffect(() => {
    // Retrieve the user's IP address and approximate location
    let ip = '';
    let city = '';
    let region = '';
    let country = '';
    
    axios.get('https://ipinfo.io')
      .then(response => {
        ip = response.data.ip;
        city = response.data.city;
        region = response.data.region;
        country = response.data.country;
       
        
        // Post the IP location data to your Flask backend using axios
        axios.post('/submit-ip-location', {
          ip: ip,
          city: city,
          region: region,
          country: country
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
  }, []);
  
  return (
    <div>
      {/* Your component JSX goes here */}
    </div>
  );
}

export default GetIp;
