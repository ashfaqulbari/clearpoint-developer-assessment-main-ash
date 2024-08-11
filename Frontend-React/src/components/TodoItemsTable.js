import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';

// Note: modifying the TodoItemsTable component to accept getItems and sortItems as props.
const TodoItemsTable = ({ items, sortOption, handleSort, handleMarkAsComplete, getItems, sortItems, loading }) => {
  const sortedItems = sortItems(items, sortOption);

  return (
    <>
      <h1>
        Showing {sortedItems.length} Item(s)
        <Button 
          variant="primary" 
          className="pull-right" 
          onClick={getItems}
          disabled={loading}  // Disable the button while loading
        >
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Refresh"}
        </Button>
      </h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Button variant="link" onClick={() => handleSort('id')}>
                Id {sortOption.column === 'id' && (sortOption.direction === 'asc' ? '↑' : '↓')}
              </Button>
            </th>
            <th>
              <Button variant="link" onClick={() => handleSort('description')}>
                Description {sortOption.column === 'description' && (sortOption.direction === 'asc' ? '↑' : '↓')}
              </Button>
            </th>
            <th>
              <Button variant="link" onClick={() => handleSort('action')}>
                Action {sortOption.column === 'action' && (sortOption.direction === 'asc' ? '↑' : '↓')}
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </td>
            </tr>
          ) : (
            sortedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  {item.isCompleted ? (
                    <span>Completed</span>
                  ) : (
                    <Button variant="warning" size="sm" onClick={() => handleMarkAsComplete(item)}>
                      Mark as completed
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default TodoItemsTable;