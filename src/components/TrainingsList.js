import React, { useState, useEffect } from 'react';
import { getTrainings, deleteTraining } from '../services/apiService';
import dayjs from 'dayjs';


function TrainingsList() {
  const [trainings, setTrainings] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await getTrainings();
      const trainingsWithId = response.map(training => ({
        ...training,
        id: training.id,
        customerName: training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : 'No Name'
      }));
      setTrainings(trainingsWithId);
    } catch (error) {
      setError(`Error fetching trainings: ${error.message}`);
    }
  };

  const handleDeleteTraining = async (id) => {
    console.log("Deleting ID:", id);
    if (!id) {
      alert("Training ID is undefined.");
      return; 
    }
    if (window.confirm("Are you sure you want to delete this training?")) {
      try {
        await deleteTraining(id);
        setTrainings(prevTrainings => prevTrainings.filter(training => training.id !== id));
      } catch (error) {
        setError(`Error deleting training: ${error.message}`);
      }
    }
  };

  const handleRequestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    sortTrainings();
  };

  const sortTrainings = () => {
    const sorted = [...trainings].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setTrainings(sorted);
  };

  const filteredTrainings = trainings.filter(training => 
    training.activity.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };


  return (
    <>
      <h1>Training List</h1>
      {error && <div className="error">{error}</div>}
      <input 
        type="text" 
        placeholder="Filter by activity" 
        value={filter} 
        onChange={handleFilterChange} 
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleRequestSort('date')}>Date</th>
            <th>Activity</th>
            <th onClick={() => handleRequestSort('duration')}>Duration (min)</th>
            <th>Customer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
      {filteredTrainings.map((training) => (
    <tr key={training.id}>
      <td>{dayjs(training.date).format('DD.MM.YYYY HH:mm')}</td>
      <td>{training.activity}</td>
      <td>{training.duration}</td>
      <td>{training.customerName}</td>
      <td>
        <button onClick={() => handleDeleteTraining(training.id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </>
  );
}

export default TrainingsList;