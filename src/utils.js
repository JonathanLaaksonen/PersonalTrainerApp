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
  filter = filter.toLowerCase();
  return customers.filter(c =>
    (c.firstname && c.firstname.toLowerCase().includes(filter)) ||
    (c.lastname && c.lastname.toLowerCase().includes(filter)) ||
    (c.streetaddress && c.streetaddress.toLowerCase().includes(filter)) ||
    (c.postcode && c.postcode.toLowerCase().includes(filter)) ||
    (c.city && c.city.toLowerCase().includes(filter)) ||
    (c.email && c.email.toLowerCase().includes(filter)) ||
    (c.phone && c.phone.toLowerCase().includes(filter))
  );
};