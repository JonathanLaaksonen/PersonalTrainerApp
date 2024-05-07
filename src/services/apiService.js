import axios from 'axios';

export const BASE_URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api';

export const getCustomers = async () => {
  return axios.get(`${BASE_URL}/customers`).then(res => res.data._embedded.customers);
};

export const addCustomer = async (customer) => {
  return axios.post(`${BASE_URL}/customers`, customer);
};

export const updateCustomer = async (id, customer) => {
  return axios.put(`${BASE_URL}/customers/${id}`, customer);
};

export const deleteCustomer = async (id) => {
  return axios.delete(`${BASE_URL}/customers/${id}`);
};

export const getTrainings = async () => {
  return axios.get(`${BASE_URL}/trainings`).then(res => res.data._embedded.trainings);
};

export const addTraining = async (training) => {
  return axios.post(`${BASE_URL}/trainings`, training);
};

export const deleteTraining = async (trainingId) => {
  if (!trainingId) {
      throw new Error("Training ID is undefined."); // Ensures that a missing ID is caught early
  }
  return axios.delete(`${BASE_URL}/trainings/${trainingId}`);
};