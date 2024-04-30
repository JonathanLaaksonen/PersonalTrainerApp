import { format } from 'date-fns';

export const formatDateTime = (dateString) => {
  return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
};

export const sortedCustomers = (customers, sortConfig) => {
  return customers.sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    const propA = a?.[sortConfig.key] || "";
    const propB = b?.[sortConfig.key] || "";

    if (sortConfig.key === 'firstname' || sortConfig.key === 'lastname') {
      return propA.localeCompare(propB) * direction;
    }

    return 0;
  });
};

export const applyFiltering = (customers, filter) => {
  if (!filter) return customers;
  return customers.filter(c => c.firstname.includes(filter) || c.lastname.includes(filter));
};