// Helper.js is a global file that provides mutli use 
// helper functions for within the application.

export const urlPrefix = process.env.REACT_APP_PROXY_HOST;

export const formatDate = ( date, dateFormat ) => {
    return moment(date).format(dateFormat)
}

// Fetches form field values from query parameters and
// returns them as a map
export const valuesFromQueryParams = queryParams => {
    return Object.entries(Object.fromEntries([...queryParams])).reduce((values, [key, value]) => {
        if (key.startsWith('values[')) {
          const vk = key.match(/values\[(.*?)\]/)[1];
          return { ...values, [vk]: value };
        }
        return values;
    }, {});
};
  
  export const getStatusColors = type => {
    switch (type.toLowerCase()) {
      case 'draft':
          return {color: 'warning.main', bgcolor: 'warning.quaternary'};
      case 'closed':
          return {color: 'success.main', bgcolor: 'success.quaternary'};
      case 'submitted':
          return {color: 'greyscale.main', bgcolor: 'primary.quaternary'};
      case 'approval':
        return {color: 'warning.main', bgcolor: 'warning.quaternary'};
      case 'submission submitted':
          return {color: 'success.main', bgcolor: 'success.quaternary'};
      default: 
          return {color: 'warning.main', bgcolor: 'warning.quaternary'};
  }
}

export const sortAlpha = ( first, second ) => {          
    const compare1 = first.name.toLowerCase();
    const compare2 = second.name.toLowerCase();

    return compare1.localeCompare(compare2);
};