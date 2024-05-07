import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addCustomer, updateCustomer, deleteCustomer, addTraining, BASE_URL} from '../services/apiService';
import { sortedCustomers, applyFiltering } from '../utils';
import './CustomersList.css';

function CustomersList() {
    const [customers, setCustomers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({
        id: '', firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''
    });
    const [newCustomer, setNewCustomer] = useState({
        firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editing, setEditing] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'firstname', direction: 'asc' });
    const [filter, setFilter] = useState('');
    const [error, setError] = useState(null);
    const [newTraining, setNewTraining] = useState({
        date: '',
        activity: '',
        duration: '',
        customerId: ''
    });
    const [showTrainingForm, setShowTrainingForm] = useState(false);
    

    useEffect(() => {
        const fetchAndProcessCustomers = async () => {
            try {
                const response = await axios.get('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers');
                if (response.data._embedded && response.data._embedded.customers) {
                    let fetchedCustomers = response.data._embedded.customers.map(customer => ({
                        ...customer,
                        id: customer._links.self.href.split('/').pop()
                    }));
                    fetchedCustomers = sortedCustomers(fetchedCustomers, sortConfig);
                    fetchedCustomers = applyFiltering(fetchedCustomers, filter);
                    setCustomers(fetchedCustomers);
                } else {
                    throw new Error("No customers found");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch customers. Please try again.');
            }
        };
        fetchAndProcessCustomers();
    }, [sortConfig, filter]); 


    const handleAddCustomer = async () => {
        try {
            const addedCustomer = await addCustomer(newCustomer);
            setCustomers([...customers, addedCustomer]);
            setNewCustomer({ firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: '' });
        } catch (error) {
            console.error('Error adding customer:', error);
            setError('Failed to add new customer.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteCustomer = async (id) => {
        if (!id) {
            console.error("No ID provided for delete operation");
            return;
        }
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(id);
                const updatedCustomers = customers.filter(customer => customer.id !== id);
                setCustomers(updatedCustomers);
            } catch (error) {
                setError(`Error deleting customer: ${error.message}`);
                console.error('Error deleting customer:', error);
            }
        }
    };

    const handleEditCustomer = (customer) => {
        setEditing(true);
        setCurrentCustomer({ ...customer });
    };

    const handleUpdateCustomer = async () => {
        if (!currentCustomer.id) {
            console.error("No ID provided for update operation");
            return;
        }
        try {
            await updateCustomer(currentCustomer.id, currentCustomer);
            const updatedCustomers = customers.map(customer => customer.id === currentCustomer.id ? currentCustomer : customer);
            setCustomers(updatedCustomers);
            setEditing(false);
        } catch (error) {
            setError(`Error updating customer: ${error.message}`);
            console.error('Error updating customer:', error);
        }
    };

    const handleRequestSort = (key) => {
        const isAscending = (sortConfig.key === key && sortConfig.direction === 'asc');
        setSortConfig({ key, direction: isAscending ? 'desc' : 'asc' });
        setCustomers(sortedCustomers(customers, { key, direction: isAscending ? 'desc' : 'asc' }));
    };

    const handleAddTraining = async () => {
        if (!newTraining.activity || !newTraining.duration || !newTraining.date || !newTraining.customerId) {
            alert("All fields are required.");
            return;
        }
        try {
            const trainingToAdd = {
                date: new Date(newTraining.date).toISOString(),
                activity: newTraining.activity,
                duration: parseInt(newTraining.duration),
                customer: `${BASE_URL}/customers/${newTraining.customerId}`
            };
            await addTraining(trainingToAdd);
            alert("Training added successfully!");
            setNewTraining({ date: '', activity: '', duration: '', customerId: '' }); 
            setShowTrainingForm(false);
        } catch (error) {
            console.error('Error adding training:', error);
            alert('Failed to add training. Please try again.');
        }
    };
    

    return (
        <>
            <h1>Customer List</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button onClick={() => setShowAddForm(!showAddForm)}>Add New Customer</button>
            {showAddForm && (
                <div>
                    <input name="firstname" placeholder="Firstname" value={newCustomer.firstname} onChange={handleInputChange} />
                    <input name="lastname" placeholder="Lastname" value={newCustomer.lastname} onChange={handleInputChange} />
                    <input name="streetaddress" placeholder="Streetaddress" value={newCustomer.streetaddress} onChange={handleInputChange} />
                    <input name="postcode" placeholder="Postcode" value={newCustomer.postcode} onChange={handleInputChange} />
                    <input name="city" placeholder="City" value={newCustomer.city} onChange={handleInputChange} />
                    <input name="email" placeholder="Email" value={newCustomer.email} onChange={handleInputChange} />
                    <input name="phone" placeholder="Phone" value={newCustomer.phone} onChange={handleInputChange} />
                    <button onClick={handleAddCustomer}>Confirm Add</button>
                    <button onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
            )}
            {editing ? (
                <div>
                    <h2>Edit Customer</h2>
                    <input type="text" name="firstname" value={currentCustomer.firstname || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, firstname: e.target.value })} />
                    <input type="text" name="lastname" value={currentCustomer.lastname || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, lastname: e.target.value })} />
                    <input type="text" name="streetaddress" value={currentCustomer.streetaddress || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, streetaddress: e.target.value})} />
                    <input type="text" name="postcode" value={currentCustomer.postcode || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, postcode: e.target.value})} />
                    <input type="text" name="city" value={currentCustomer.city || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, city: e.target.value })} />
                    <input type="email" name="email" value={currentCustomer.email || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, email: e.target.value })} />
                    <input type="tel" name="phone" value={currentCustomer.phone || ''} onChange={e => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })} />
                    <button onClick={handleUpdateCustomer}>Update Customer</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            ) : (
                <input type="text" placeholder="Filter by name" value={filter} onChange={e => setFilter(e.target.value)} />
            )}
            {showTrainingForm && (
            <div>
                <h2>Add Training</h2>
                <input type="datetime-local" name="date" value={newTraining.date} onChange={e => setNewTraining({ ...newTraining, date: e.target.value })} />
                <input type="text" name="activity" placeholder="Activity" value={newTraining.activity} onChange={e => setNewTraining({ ...newTraining, activity: e.target.value })} />
                <input type="number" name="duration" placeholder="Duration (in minutes)" value={newTraining.duration} onChange={e => setNewTraining({ ...newTraining, duration: e.target.value })} />
                <button onClick={handleAddTraining}>Confirm Add</button>
                <button onClick={() => setShowTrainingForm(false)}>Cancel</button>
            </div>
            )}

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
                        <th>Actions</th>
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
                            <td>
                                <button onClick={() => handleEditCustomer(customer)}>Edit</button>
                                <button onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
                                <button onClick={() => { setShowTrainingForm(true); setNewTraining({ ...newTraining, customerId: customer.id })}}>Add Training</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default CustomersList;