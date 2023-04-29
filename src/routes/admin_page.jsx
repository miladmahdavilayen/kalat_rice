import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCustomerClick = (customerId) => {
    setSelectedCustomerId((prevSelectedCustomerId) =>
      prevSelectedCustomerId === customerId ? null : customerId
    );
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const handleRefreshClick = () => {
    fetchCustomers();
  };

  return (
    <div>
      <div className="database">
        <div className="search-bar">
          <input
            type="text"
            placeholder="جستجو ..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="customer-table" dir="rtl">
          <thead dir="rtl">
            <tr dir="rtl">
              <th dir="rtl">نام</th>
              <th dir="rtl">تلفن</th>
              <th dir="rtl">تاریخ ثبت</th>
              <th dir="rtl">خریدها</th>
            </tr>
          </thead>
          <tbody dir="rtl">
            {filteredCustomers.map((customer) => (
              <React.Fragment key={customer.name}>
                <tr
                  className="customer-row"
                  dir="rtl"
                  onClick={() => handleCustomerClick(customer.name)}
                >
                  <td> &nbsp;&nbsp; {customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.date_registered}</td>
                  <td>{selectedCustomerId === customer.name ? "▲" : "▼"}</td>
                </tr>
                {selectedCustomerId === customer.name &&
                  customer.orders.map((order, index) => (
                    <tr className="order-row" key={index + 1}>
                      <td
                        colSpan="4"
                        dir="rtl"
                        style={{ fontSize: "10px" }}
                      >
                        &nbsp;{index + 1}-&nbsp;&nbsp; مقدار برنج:{" "}
                        {order.final_amount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; روش
                        دریافت: {order.delivery_type} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        زمان ثبت سفارش: {order.order_date_time} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        کد رهگیری: {order.order_id}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-group">
        <button className="logout" onClick={() => window.location.reload()}>خروج</button>
        <button className="reload" onClick={handleRefreshClick}>
        بارگذاری مجدد
      </button>
      </div>
    </div>
  );
};

export default CustomerTable;
