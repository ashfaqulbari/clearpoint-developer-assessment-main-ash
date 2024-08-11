import React from 'react';
import { Container, Form, Row, Col, Stack, Button } from 'react-bootstrap';

const AddTodoItemForm = ({ description, handleDescriptionChange, handleAdd, handleClear, handleKeyPress }) => (
  <Container>
    <h1>Add Item</h1>
    <Form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
      <Form.Group as={Row} className="mb-3" controlId="formAddTodoItem">
        <Form.Label column sm="2">Description</Form.Label>
        <Col md="6">
          <Form.Control
            type="text"
            placeholder="Enter description..."
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleKeyPress}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
        <Stack direction="horizontal" gap={2}>
          <Button variant="primary" type="submit">Add Item</Button>
          <Button variant="secondary" onClick={handleClear}>Clear</Button>
        </Stack>
      </Form.Group>
    </Form>
  </Container>
);

export default AddTodoItemForm;