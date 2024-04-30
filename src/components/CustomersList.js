import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { sortedCustomers, applyFiltering } from '../utils';
import './CustomersList.css';

const BASE_URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api';

function CustomersList() {
   const [customers, setCustomers] = useState([]);
   const [sortConfig, setSortConfig] = useState({ key: 'firstname', direction: 'asc' });
   const [filter, setFilter] = useState('');
   const [error, setError] = useState(null);

   useEffect(() => {
      fetchCustomers();
   }, [sortConfig, filter]);

   const fetchCustomers = async () => {
      try {
         const response = await axios.get(`${BASE_URL}/customers`);
         let fetchedCustomers = response.data?._embedded?.customers || [];

         fetchedCustomers = sortedCustomers(fetchedCustomers, sortConfig);
         fetchedCustomers = applyFiltering(fetchedCustomers, filter);

         setCustomers(fetchedCustomers);
      } catch (error) {
         setError('Error fetching customers: ' + error.message);
         console.error('Error fetching customers:', error);
      }
   };

   const handleRequestSort = (key) => {
      const isAscending = (sortConfig.key === key && sortConfig.direction === 'asc');
      setSortConfig({ key, direction: isAscending ? 'desc' : 'asc' });
      setCustomers(sortedCustomers(customers, { key, direction: isAscending ? 'desc' : 'asc' }));
   };

   return (
      <>
         {error && <div style={{ color: 'red' }}>{error}</div>}
         <input type="text" placeholder="Filter by name" value={filter} onChange={(e) => setFilter(e.target.value)} />

         <table>
            <thead>
               <tr>
                  <th onClick={() => handleRequestSort('firstname')}>Firstname</th>
                  <th onClick={() => handleRequestSort('lastname')}>Lastname</th>
                  <th>Streetaddress</th>
                  <th>Postcode</th>
                  <th>City</th>
                  <th>Email</th>
                  <th>Phone</th>
               </tr>
            </thead>
            <tbody>
               {customers.map(customer => (
                  <tr key={customer.id || `${customer.firstname}-${customer.lastname}`}>
                     <td>{customer.firstname}</td>
                     <td>{customer.lastname}</td>
                     <td>{customer.streetaddress}</td>
                     <td>{customer.postcode}</td>
                     <td>{customer.city}</td>
                     <td>{customer.email}</td>
                     <td>{customer.phone}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </>
   );
}

export default CustomersList;