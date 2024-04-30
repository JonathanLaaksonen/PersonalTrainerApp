import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api';

function TrainingsList() {
  const [trainings, setTrainings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, [sortConfig, filter]);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trainings`);
      console.log(response.data); // Log the structure for debugging

      let fetchedTrainings = response.data?._embedded?.trainings || [];

      fetchedTrainings = await Promise.all(fetchedTrainings.map(async (training) => {
        try {
          const customerResponse = await axios.get(training._links.customer.href);
          training.customer = customerResponse.data;
        } catch (err) {
          console.error("Error fetching customer info:", err);
          training.customer = { firstname: "Unknown", lastname: "Customer" };
        }
        return training;
      }));

      fetchedTrainings = sortedTrainings(fetchedTrainings, sortConfig);
      fetchedTrainings = applyFiltering(fetchedTrainings, filter);

      setTrainings(fetchedTrainings);
    } catch (error) {
      setError(`Error fetching trainings: ${error.message}`);
      console.error('Error fetching trainings:', error);
    }
  };

  const sortedTrainings = (trainings, config) => {
    if (!Array.isArray(trainings)) return [];
    return trainings.sort((a, b) => {
      const direction = config.direction === 'asc' ? 1 : -1;
      const propA = a?.[config.key] || "";
      const propB = b?.[config.key] || "";

      if (propA < propB) return -1 * direction;
      if (propA > propB) return 1 * direction;
      return 0;
    });
  };

  const applyFiltering = (trainings, filter) => {
    return trainings.filter(training => training.activity.toLowerCase().includes(filter.toLowerCase()));
  };

  const handleRequestSort = (key) => {
    const isAscending = (sortConfig.key === key && sortConfig.direction === 'asc');
    const newConfig = { key, direction: isAscending ? 'desc' : 'asc' };
    setSortConfig(newConfig);
    setTrainings(sortedTrainings(trainings, newConfig));
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const formatDateTime = (isoDate) => {
    return dayjs(isoDate).format('DD.MM.YYYY HH:mm');
  };

  return (
    <>
      {error && <div className="error">{error}</div>}
      <input type="text" placeholder="Filter by activity" value={filter} onChange={handleFilterChange} />

      <table>
        <thead>
          <tr>
            <th onClick={() => handleRequestSort('date')}>Date</th>
            <th>Activity</th>
            <th>Duration (minutes)</th>
            <th>Customer</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((training, index) => (
            <tr key={training.id || index}>
              <td>{formatDateTime(training.date)}</td>
              <td>{training.activity}</td>
              <td>{training.duration}</td>
              <td>{training.customer.firstname} {training.customer.lastname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TrainingsList;
