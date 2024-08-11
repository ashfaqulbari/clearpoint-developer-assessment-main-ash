import './App.css'
import { Image, Alert, Button, Container, Row, Col, Form, Table, Stack } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { API_ENDPOINTS } from './config'; // Importing the API endpoints
import AddTodoItemForm from './components/AddTodoItemForm';
import TodoItemsTable from './components/TodoItemsTable';
import { sortItems, handleError } from './helpers/utils'; // Importing helper functions

const App = () => {
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  //Adding a state to keep track of current sorting option
  const [sortOption, setSortOption] = useState('id');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getItems();
  }, [])

  // Adding a function to handle sorting
  const handleSort = (column) => {
    const newDirection = sortOption.column === column && sortOption.direction === 'asc' ? 'desc' : 'asc';
    setSortOption({ column, direction: newDirection });
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }

  const getItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADD_TODO);
      setItems(response.data);
    } catch (error) {
      handleAdd(error);
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
      handleAdd();
    }
  };

  const handleAdd = async () => {
      // Trimming whitespace from the description, add a validation in the BE too
      if (description.trim() === '') {
          alert('Description is required');
          return;
      }
  
      // Validate description using regular expression
      const regex = /^[a-zA-Z0-9\s]*$/;
      if (!regex.test(description)) {
          alert('Description can only contain letters and numbers');
          return;
      }
    
      setLoading(true);
      try {
          const response = await axios.post(API_ENDPOINTS.ADD_TODO, { description });
          setItems([...items, response.data]);
          setDescription('');  // Clear the input after successful addition
      } catch (error) {
          handleError(error);
      } finally {
          setLoading(false);
      }
  };

  function handleClear() {
    setDescription('')
  }

  const handleMarkAsComplete = async (item) => {
    setLoading(true);
    try {
      await axios.put(`${API_ENDPOINTS.ADD_TODO}/${item.id}`, { ...item, isCompleted: true });
      setItems(items.map(i => (i.id === item.id ? { ...i, isCompleted: true } : i)));
    } catch (error) {
      handleError(error);
      console.error('Failed to mark item as complete:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Image src="clearPointLogo.png" fluid rounded />
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="success">
              <Alert.Heading>Todo List App</Alert.Heading>
              Welcome to the ClearPoint frontend technical test. We like to keep things simple, yet clean so your
              task(s) are as follows:
              <br />
              <br />
              <ol className="list-left">
                <li>Add the ability to add (POST) a Todo Item by calling the backend API</li>
                <li>
                  Display (GET) all the current Todo Items in the below grid and display them in any order you wish
                </li>
                <li>
                  Bonus points for completing the 'Mark as completed' button code for allowing users to update and mark
                  a specific Todo Item as completed and for displaying any relevant validation errors/ messages from the
                  API in the UI
                </li>
                <li>Feel free to add unit tests and refactor the component(s) as best you see fit</li>
              </ol>
            </Alert>
          </Col>
        </Row>
        <Row>
          {/* <Col>{renderAddTodoItemContent()}</Col> */}
          <AddTodoItemForm
              description={description}
              handleDescriptionChange={handleDescriptionChange}
              handleAdd={handleAdd}
              handleClear={handleClear}
              onKeyDown={handleKeyPress}
            />
        </Row>
        <br />
        <Row>
          {/* <Col>{renderTodoItemsContent()}</Col> */}
          <TodoItemsTable
              items={items}
              sortOption={sortOption}
              handleSort={handleSort}
              handleMarkAsComplete={handleMarkAsComplete}
              getItems={getItems}
              sortItems={sortItems}
              loading={loading}
            />
        </Row>
      </Container>
      <footer className="page-footer font-small teal pt-4">
        <div className="footer-copyright text-center py-3">
          © 2021 Copyright:
          <a href="https://clearpoint.digital" target="_blank" rel="noreferrer">
            clearpoint.digital
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
