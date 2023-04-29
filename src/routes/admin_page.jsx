import React, { useState, useEffect } from "react";
import axios from "axios";


const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [exit_b, setExit] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = (customerId) => {
    setSelectedCustomerId((prevSelectedCustomerId) =>
      prevSelectedCustomerId === customerId ? null : customerId
    );
  };

  

  return (
    <div>   
    {exit_b? <h1 dir="rtl" style={{color: 'black', background: 'red'}} >میتوانید صفحه را ببندید.</h1>: 
    <>
    <table className="customer-table" dir="rtl">
      <thead dir="rtl">
        <tr dir="rtl">
          <th dir="rtl">نام</th>
          <th dir="rtl">تلفن</th>
          <th dir="rtl">آدرس</th>
          <th dir="rtl">خریدها</th>
        </tr>
      </thead>
      <tbody dir="rtl">
        {customers.map((customer) => (
          <React.Fragment key={customer.name}>
            <tr
              className="customer-row"
              dir="rtl"
              onClick={() => handleCustomerClick(customer.name)}
            >
              <td> &nbsp;&nbsp; {customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>{selectedCustomerId === customer.name ? "▲" : "▼"}</td>
            </tr>
            {selectedCustomerId === customer.name &&
              customer.orders.map((order) => (
                <tr className="order-row" key={order.id}>
                  <td colSpan="4" style={{fontSize: '10px'}}>
                    initial amount: {order.initial_amount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; delivery type: {order.delivery_type} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; order time: {order.order_date_time} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; tracking number: {order.order_id}
                  </td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
    <button className="logout" onClick={() => setExit(true)}>خروج</button>
              
    </> }   

    </div>);
};

export default CustomerTable;
