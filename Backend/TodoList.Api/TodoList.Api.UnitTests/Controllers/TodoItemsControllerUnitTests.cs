using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using TodoList.Api.Controllers;
using TodoList.Api.Models;
using TodoList.Api.Services;
using Xunit;

namespace TodoList.Api.UnitTests.Controllers
{
    public class TodoItemsControllerUnitTests
    {
        private readonly Mock<ITodoService> _mockTodoService;
        private readonly Mock<ILogger<TodoItemsController>> _mockLogger;
        private readonly TodoItemsController _controller;

        public TodoItemsControllerUnitTests()
        {
            // Mocking the dependencies
            _mockTodoService = new Mock<ITodoService>();
            _mockLogger = new Mock<ILogger<TodoItemsController>>();
            
            // Initializing the controller with the mocked dependencies
            _controller = new TodoItemsController(_mockTodoService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetTodoItems_ReturnsOkResult_WithListOfTodoItems()
        {
            // Arrange
            var mockTodoItems = new List<TodoItem>
            {
                new TodoItem { Id = Guid.NewGuid(), Description = "Task 1", IsCompleted = false },
                new TodoItem { Id = Guid.NewGuid(), Description = "Task 2", IsCompleted = false }
            };

            _mockTodoService.Setup(service => service.GetIncompleteTodoItems())
                .ReturnsAsync(mockTodoItems);

            // Act
            var result = await _controller.GetTodoItems();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<TodoItem>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetTodoItems_ReturnsInternalServerError_OnException()
        {
            // Arrange
            _mockTodoService.Setup(service => service.GetIncompleteTodoItems())
                .ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.GetTodoItems();

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
            Assert.Equal("Internal server error", statusCodeResult.Value);
        }

        // Testing the GetTodoItems Method

        [Fact]
        public async Task GetTodoItems_ReturnsOkResult_WithListOfIncompleteItems()
        {
            // Arrange: Setup the mock service to return a list of incomplete todo items
            var mockItems = new List<TodoItem>
            {
                new TodoItem { Id = Guid.NewGuid(), Description = "Task 1", IsCompleted = false },
                new TodoItem { Id = Guid.NewGuid(), Description = "Task 2", IsCompleted = false }
            };
            _mockTodoService.Setup(service => service.GetIncompleteTodoItems()).ReturnsAsync(mockItems);

            // Act: Call the method under test
            var result = await _controller.GetTodoItems();

            // Assert: Verify that the result is an OkObjectResult containing the expected list of items
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnItems = Assert.IsType<List<TodoItem>>(okResult.Value);
            Assert.Equal(2, returnItems.Count);
        }

        // Testing the GetTodoItem Method

        [Fact]
        public async Task GetTodoItem_ReturnsOkResult_WithSpecificItem()
        {
            // Arrange: Setup the mock service to return a specific todo item by ID
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = itemId, Description = "Task 1", IsCompleted = false };
            _mockTodoService.Setup(service => service.GetTodoItemById(itemId)).ReturnsAsync(mockItem);

            // Act: Call the method under test
            var result = await _controller.GetTodoItem(itemId);

            // Assert: Verify that the result is an OkObjectResult containing the expected item
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnItem = Assert.IsType<TodoItem>(okResult.Value);
            Assert.Equal(itemId, returnItem.Id);
        }

        [Fact]
        public async Task GetTodoItem_ReturnsNotFound_WhenItemDoesNotExist()
        {
            // Arrange: Setup the mock service to return null when the item does not exist
            var itemId = Guid.NewGuid();
            _mockTodoService.Setup(service => service.GetTodoItemById(itemId)).ReturnsAsync((TodoItem)null);

            // Act: Call the method under test
            var result = await _controller.GetTodoItem(itemId);

            // Assert: Verify that the result is a NotFoundResult
            Assert.IsType<NotFoundResult>(result);
        }


         // Edge Case: No Items Found for GetTodoItems Method
        [Fact]
        public async Task GetTodoItems_ReturnsOkResult_WithEmptyList_WhenNoItemsFound()
        {
            // Arrange: Setup the mock service to return an empty list of todo items
            _mockTodoService.Setup(service => service.GetIncompleteTodoItems())
                            .ReturnsAsync(new List<TodoItem>());

            // Act: Call the method under test
            var result = await _controller.GetTodoItems();

            // Assert: Verify that the result is an OkObjectResult containing an empty list
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnItems = Assert.IsType<List<TodoItem>>(okResult.Value);
            Assert.Empty(returnItems);
        }

        // Edge Case: Test Invalid ID Format for GetTodoItem Method
        [Fact]
        public async Task GetTodoItem_ReturnsBadRequest_ForInvalidIdFormat()
        {
            // Arrange: Invalid GUID string
            var invalidGuid = Guid.Empty;

            // Act: Call the method under test with an invalid GUID
            var result = await _controller.GetTodoItem(invalidGuid);

            // Assert: Verify that the result is also categorized as under 404 not found status code
            var statusCodeResult = Assert.IsType<NotFoundResult>(result);
            Assert.Equal(404, statusCodeResult.StatusCode);
        }

        // Edge Case: Service Unavailability for GetTodoItems Method:

        [Fact]
        public async Task GetTodoItems_ReturnsServiceUnavailable_WhenServiceIsDown()
        {
            // Arrange: Setup the mock service to simulate a service unavailability
            _mockTodoService.Setup(service => service.GetIncompleteTodoItems())
                            .ThrowsAsync(new Exception("Internal server error"));

            // Act: Call the method under test
            var result = await _controller.GetTodoItems();

            // Assert: Verify that the result is a StatusCodeResult indicating a service unavailability
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
            Assert.Equal("Internal server error", statusCodeResult.Value);
        }

        // Testing the PutTodoItem Method

        [Fact]
        public async Task PutTodoItem_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange: Setup the mock service to return true when the update is successful
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = itemId, Description = "Updated Task", IsCompleted = true };
            _mockTodoService.Setup(service => service.UpdateTodoItem(itemId, mockItem)).ReturnsAsync(true);

            // Act: Call the method under test
            var result = await _controller.PutTodoItem(itemId, mockItem);

            // Assert: Verify that the result is a NoContentResult, indicating success
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PutTodoItem_ReturnsNotFound_WhenItemDoesNotExist()
        {
            // Arrange: Setup the mock service to return false when the item does not exist
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = itemId, Description = "Updated Task", IsCompleted = true };
            _mockTodoService.Setup(service => service.UpdateTodoItem(itemId, mockItem)).ReturnsAsync(false);

            // Act: Call the method under test
            var result = await _controller.PutTodoItem(itemId, mockItem);

            // Assert: Verify that the result is a NotFoundResult
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PutTodoItem_ReturnsBadRequest_WhenIdMismatchOccurs()
        {
            // Arrange: Setup a mismatch between the route ID and the todo item ID
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = Guid.NewGuid(), Description = "Updated Task", IsCompleted = true };

            // Act: Call the method under test
            var result = await _controller.PutTodoItem(itemId, mockItem);

            // Assert: Verify that the result is a BadRequestObjectResult indicating an ID mismatch
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("ID mismatch", badRequestResult.Value);
        }


        // Edge Case: Concurrency Issues for PutTodoItem Method
        [Fact]
        public async Task PutTodoItem_HandlesConcurrencyIssues_WhenUpdating()
        {
            // Arrange: Setup the mock service to throw a DbUpdateConcurrencyException
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = itemId, Description = "Task", IsCompleted = false };

            _mockTodoService.Setup(service => service.UpdateTodoItem(itemId, mockItem))
                            .ThrowsAsync(new Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException());

            // Act: Call the method under test
            var result = await _controller.PutTodoItem(itemId, mockItem);

            // Assert: Verify that the result is a StatusCodeResult indicating a concurrency issue
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }

        // Testing the PostTodoItem method
        [Fact]
        public async Task PostTodoItem_ReturnsCreatedAtActionResult_WithNewItem()
        {
            // Arrange: Setup the mock service to return a newly created todo item
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = itemId, Description = "New Task", IsCompleted = false };
            _mockTodoService.Setup(service => service.CreateTodoItem(mockItem)).ReturnsAsync(mockItem);

            // Act: Call the method under test
            var result = await _controller.PostTodoItem(mockItem);

            // Assert: Verify that the result is a CreatedAtActionResult with the correct values
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnItem = Assert.IsType<TodoItem>(createdAtActionResult.Value);
            Assert.Equal(itemId, returnItem.Id);
            Assert.Equal("New Task", returnItem.Description);
        }

        [Fact]
        public async Task PostTodoItem_ReturnsBadRequest_WhenDescriptionIsMissing()
        {
            // Arrange: Setup an invalid todo item with a missing description
            var mockItem = new TodoItem { Id = Guid.NewGuid(), Description = string.Empty, IsCompleted = false };

            // Act: Call the method under test
            var result = await _controller.PostTodoItem(mockItem);

            // Assert: Verify that the result is a BadRequestObjectResult indicating a missing description
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Description is required", badRequestResult.Value);
        }

        // Edge Case: Duplicate Items for PostTodoItem Method:
        [Fact]
        public async Task PostTodoItem_ReturnsConflict_WhenDuplicateItemExists()
        {
            // Arrange: Setup a mock to simulate a duplicate item
            var itemId = Guid.NewGuid();
            var mockItem = new TodoItem { Id = itemId, Description = "Duplicate Task", IsCompleted = false };

            // Simulate existing item with same description
            _mockTodoService.Setup(service => service.GetIncompleteTodoItems())
                            .ReturnsAsync(new List<TodoItem> { mockItem });

            // Act: Call the method under test
            var result = await _controller.PostTodoItem(mockItem);

            // Assert: Verify that the result is an ObjectResult with a 409 status code
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.Equal(409, conflictResult.StatusCode);
            Assert.Equal("An incomplete item with the same description already exists.", conflictResult.Value);
        }
    }
}
