import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import App from '../App';
import axios from 'axios';
import { API_ENDPOINTS } from '../config'; // Importing the API endpoints
import { handleError } from '../helpers/utils'; // Importing the handleError function

jest.mock('axios'); // Mocking axios to control its behavior in the test

describe('Todo List App', () => {

  test('renders the footer text', () => {
    render(<App />)
    const footerElement = screen.getByText(/clearpoint.digital/i)
    expect(footerElement).toBeInTheDocument()
  })

  test('should clear the description input field when "Clear" button is clicked', () => {
    render(<App />);
    
    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter description...'), { target: { value: 'Sample Task' } });
    
    // Assert that the input field has the value 'Sample Task'
    expect(screen.getByPlaceholderText('Enter description...').value).toBe('Sample Task');
    
    // Simulate clicking the "Clear" buttons
    fireEvent.click(screen.getByText('Clear'));
    
    // Assert that the input field is cleared
    expect(screen.getByPlaceholderText('Enter description...').value).toBe('');
  });
  

  test('should add a new todo item when "Add Item" button is clicked', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 3, description: 'New Task', isCompleted: false } });
  
    render(<App />);
    
    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter description...'), { target: { value: 'New Task' } });
    
    // Simulate button click specifically on the button with role and name
    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));
    
    // Assert the new task is added to the list
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });
  

  test('should fetch and display the list of todo items on load', async () => {
    // Arranging: Mock the API response
    const mockItems = [
      { id: 1, description: 'Task 1', isCompleted: false },
      { id: 2, description: 'Task 2', isCompleted: true },
    ];
    axios.get.mockResolvedValueOnce({ data: mockItems });

    // Act: Render the App component
    render(<App />);

    // Assert: Check that the items are displayed
    for (let item of mockItems) {
      expect(await screen.findByText(item.description)).toBeInTheDocument();
    }
  });

  test('should sort the todo items by description when description column is clicked', async () => {
    const mockItems = [
      { id: 1, description: 'Task B', isCompleted: false },
      { id: 2, description: 'Task A', isCompleted: true },
    ];
    axios.get.mockResolvedValueOnce({ data: mockItems });

    render(<App />);

    // Wait until the items are displayed and loading is finished
    await screen.findByText('Task B'); // Wait for "Task B" to be rendered
    await screen.findByText('Task A'); // Wait for "Task A" to be rendered
   
    // Find the "Description" button in the table header and click it
    const descriptionSortButton = screen.getAllByText('Description').find((el) => el.tagName === 'BUTTON');
    fireEvent.click(descriptionSortButton);

    const sortedItems = await screen.findAllByRole('row');
    expect(sortedItems[1]).toHaveTextContent('Task A'); // Task A should be first
    expect(sortedItems[2]).toHaveTextContent('Task B'); // Task B should be second
  });

  test('should sort the todo items by Id when Id column is clicked', async () => {
    const mockItems = [
      { id: 'c2abae8d-89b1-4c04-82e8-5fec9f76c6d5', description: 'Task B', isCompleted: false },
      { id: 'be60278b-99c7-4d20-8129-d33233868e98', description: 'Task A', isCompleted: true },
    ];
    axios.get.mockResolvedValueOnce({ data: mockItems });

    render(<App />);

    // Wait until the items are displayed and loading is finished
    await screen.findByText('Task B'); // Wait for "Task B" to be rendered
    await screen.findByText('Task A'); // Wait for "Task A" to be rendered

    // Find the "Id" button in the table header and click it
    const idSortButton = screen.getAllByText('Id').find((el) => el.tagName === 'BUTTON');
    fireEvent.click(idSortButton);

    const sortedItems = await screen.findAllByRole('row');

    // Verify the order based on IDs (Task A should come first based on the order of IDs)
    expect(sortedItems[1]).toHaveTextContent('be60278b-99c7-4d20-8129-d33233868e98'); // ID for Task A should be first
    expect(sortedItems[2]).toHaveTextContent('c2abae8d-89b1-4c04-82e8-5fec9f76c6d5'); // ID for Task B should be second
  });

  test('should mark a todo item as completed when Mark as completed button is clicked', async () => {
    const mockItems = [
      { id: 'be60278b-99c7-4d20-8129-d33233868e98', description: 'Task A', isCompleted: false },
    ];
    
    axios.get.mockResolvedValueOnce({ data: mockItems });
    
    render(<App />);
  
    // Wait for the items to be rendered
    await screen.findByText('Task A');
  
    // Mock the PUT request for marking a task as complete
    axios.put.mockResolvedValueOnce({});
  
    // Find the "Mark as completed" button for Task A and click it
    const markAsCompleteButton = screen.getAllByText('Mark as completed')[0];
    fireEvent.click(markAsCompleteButton);
  
    // Wait for the updated task status to be reflected
    expect(await screen.findByText('Completed')).toBeInTheDocument();
  
    // Verify that the PUT request was made to the correct endpoint
    expect(axios.put).toHaveBeenCalledWith(
      `${API_ENDPOINTS.ADD_TODO}/be60278b-99c7-4d20-8129-d33233868e98`,
      { id: 'be60278b-99c7-4d20-8129-d33233868e98', description: 'Task A', isCompleted: true }
    );
  });


  // To do: Not working, come back! 
  test('should sort the todo items by action (completed status) when Action column is clicked', async () => {
    const mockItems = [
      { id: '2', description: 'Task B', isCompleted: false },
      { id: '1', description: 'Task A', isCompleted: true },
    ];
    axios.get.mockResolvedValueOnce({ data: mockItems });
  
    render(<App />);
  
    // Wait until the items are displayed
    await screen.findByText('Task B'); // Wait for "Task B" to be rendered
    await screen.findByText('Task A'); // Wait for "Task A" to be rendered
   
    // Find the "Action" button in the table header and click it to sort
    const actionSortButton = screen.getAllByText('Action').find((el) => el.tagName === 'BUTTON');
    fireEvent.click(actionSortButton);
  
    // Since 'Task A' is completed, it should appear first after sorting
    const sortedItems = await screen.findAllByRole('row');

      // Log the text content of each row for debugging
    sortedItems.forEach((row, index) => {
      console.log(`Row ${index + 1}: ${row.textContent}`);
    });
  
    // Since 'Task A' is completed, it should appear first after sorting
    expect(sortedItems[1]).toHaveTextContent('Task A'); // Task A should be first
    expect(sortedItems[2]).toHaveTextContent('Task B'); // Task B should be second
  });

  // test('should remove completed items and retain "Mark as completed" items when "Refresh" button is clicked', async () => {
  //   const mockItems = [
  //     { id: '1', description: 'Task A', isCompleted: true },
  //     { id: '2', description: 'Task B', isCompleted: false },
  //   ];
    
  //   axios.get.mockResolvedValueOnce({ data: mockItems });
    
  //   render(<App />);
    
  //   // Wait until the items are displayed
  //   await screen.findByText((content, element) => element.tagName.toLowerCase() === 'td' && content.includes('Task A'));
  //   await screen.findByText((content, element) => element.tagName.toLowerCase() === 'td' && content.includes('Task B'));
    
  //   // Simulate clicking the "Refresh" button
  //   fireEvent.click(screen.getByText('Refresh'));
    
  //   // Assert that the completed item "Task A" is no longer in the document
  //   expect(screen.queryByText((content, element) => element.tagName.toLowerCase() === 'td' && content.includes('Task A'))).not.toBeInTheDocument();
    
  //   // Assert that the item "Task B" with "Mark as completed" button is still in the document
  //   expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'td' && content.includes('Task B'))).toBeInTheDocument();
  //   expect(screen.getByText('Mark as completed')).toBeInTheDocument();
  // });

  test('should remove completed items and retain "Mark as completed" items when "Refresh" button is clicked', async () => {
    const mockItems = [
      { id: '1', description: 'Task A', isCompleted: true },
      { id: '2', description: 'Task B', isCompleted: false },
    ];
  
    axios.get.mockResolvedValueOnce({ data: mockItems });
  
    render(<App />);
  
    // Wait until the items are displayed
    const rowsBeforeRefresh = await screen.findAllByRole('row');
    // Wait for the UI to update after the refresh
    await screen.findByText('Loading...'); // Wait for the "Loading..." indicator to appear and disappear

    expect(rowsBeforeRefresh[1]).toHaveTextContent('Task A');
    expect(rowsBeforeRefresh[2]).toHaveTextContent('Task B');
  
    // Simulate clicking the "Refresh" button
    fireEvent.click(screen.getByText('Refresh'));
  
    // Mock the new GET request that should return only the incomplete items
    axios.get.mockResolvedValueOnce({ data: [mockItems[1]] });  // Only Task B should be returned
  
    // Wait for the UI to update after the refresh
    await screen.findByText('Loading...'); // Wait for the "Loading..." indicator to appear and disappear
  
    const rowsAfterRefresh = await screen.findAllByRole('row');
  
    // Assert that only "Task B" remains
    expect(rowsAfterRefresh).toHaveLength(2); // 1 header row + 1 data row
    expect(rowsAfterRefresh[1]).toHaveTextContent('Task B');
    expect(rowsAfterRefresh[1]).toHaveTextContent('Mark as completed');
  
    // Assert that "Task A" is no longer present
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
  });
  
  //Testing API failure scenarios too

  test('should alert with the server error message when error.response exists', () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid request data',
        },
      },
    };
  
    // Mock the alert function
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  
    // Call the handleError function with the mock error
    handleError(mockError);
  
    // Assert that the alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Failed: Invalid request data');
  
    // Cleanup the mock
    window.alert.mockRestore();
  });

  test('should alert with a generic error message when error.response exists but no message is provided', () => {
    const mockError = {
      response: {
        data: {},
      },
    };
  
    // Mock the alert function
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  
    // Call the handleError function with the mock error
    handleError(mockError);
  
    // Assert that the alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Failed: An error occurred');
  
    // Cleanup the mock
    window.alert.mockRestore();
  });
  
  test('should alert with a no response message when error.request exists', () => {
    const mockError = {
      request: {},
    };
  
    // Mock the alert function
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  
    // Call the handleError function with the mock error
    handleError(mockError);
  
    // Assert that the alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('No response from the server. Please try again later.');
  
    // Cleanup the mock
    window.alert.mockRestore();
  });

  test('should alert with the error message when only error.message exists', () => {
    const mockError = {
      message: 'Network error',
    };
  
    // Mock the alert function
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  
    // Call the handleError function with the mock error
    handleError(mockError);
  
    // Assert that the alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Error: Network error');
  
    // Cleanup the mock
    window.alert.mockRestore();
  });
  
  test('should handle unexpected error objects gracefully', () => {
    // Test with undefined
    let mockError = undefined;
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    handleError(mockError);
    expect(window.alert).not.toHaveBeenCalled(); // No alert should be called
    window.alert.mockRestore();
  
    // Test with null
    mockError = null;
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    handleError(mockError);
    expect(window.alert).not.toHaveBeenCalled(); // No alert should be called
    window.alert.mockRestore();
  
    // Test with an empty object
    mockError = {};
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    handleError(mockError);
    expect(window.alert).not.toHaveBeenCalled(); // No alert should be called
    window.alert.mockRestore();
  });
});