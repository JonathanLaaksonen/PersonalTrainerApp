import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomersList from './components/CustomersList';
import TrainingsList from './components/TrainingsList';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<CustomersList />} />
        <Route path="/trainings" element={<TrainingsList />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;