/**
 * Function to sort the todo items based on the given sort option.
 * @param {Array} items - The list of items to sort.
 * @param {Object} sortOption - The current sort option with column and direction.
 * @returns {Array} - The sorted list of items.
 */
export const sortItems = (items, sortOption) => {
  // Create a shallow copy of the items array to avoid mutating the original array
  let sortedItems = [...items];

  // Use the JavaScript sort method to sort the copied array based on the sortOption provided
  sortedItems.sort((a, b) => {
      let comparison = 0; // This will hold the comparison result between two items

      // Check which column we are sorting by
      if (sortOption.column === 'id') {
          // If the sorting column is 'id', compare the ids as strings
          // localeCompare is used for comparing strings in JavaScript
          comparison = a.id.localeCompare(b.id);
      } else if (sortOption.column === 'description') {
          // If the sorting column is 'description', compare the descriptions as strings
          // localeCompare is also used here to ensure proper string comparison
          comparison = a.description.localeCompare(b.description);
      } else if (sortOption.column === 'action') {
          // If the sorting column is 'action', compare the completion status
          // This will result in sorting by the boolean value (false < true)
          comparison = a.isCompleted - b.isCompleted;
      }

      // Determine the sort direction (ascending or descending)
      // If the direction is 'asc', return the comparison as is
      // If the direction is 'desc', negate the comparison result to reverse the order
      return sortOption.direction === 'asc' ? comparison : -comparison;
  });
  return sortedItems;
};

  /**
   * Function to handle and display errors.
   * @param {Object} error - The error object returned from the API call.
   */
  export const handleError = (error) => {
    let errorMessage = 'An error occurred';
  
    if (error.response) {
        // Handle errors returned from the backend
        const backendMessage = 
            (typeof error.response.data === 'string' && error.response.data) || 
            error.response.data?.message || 
            'An error occurred on the server';
        errorMessage = `Failed: ${backendMessage}`;
    } else if (error.request) {
        // Handle errors where the request was made but no response was received
        errorMessage = 'No response from the server. Please try again later.';
    } else {
        // Handle other errors
        errorMessage = `Error: ${error.message}`;
    }
  
    alert(errorMessage);
    console.error('Error:', error);
    
    return errorMessage; // Return the error message for further use if needed
};
  