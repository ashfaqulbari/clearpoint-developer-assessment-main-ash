using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using TodoList.Api.Models;
using TodoList.Api.Services;

namespace TodoList.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly ITodoService _todoService;  // Service layer dependency for business logic
        private readonly ILogger<TodoItemsController> _logger;  // Logger for recording errors and information
        public TodoItemsController(ITodoService todoService, ILogger<TodoItemsController> logger)
        {
            _todoService = todoService;
            _logger = logger;
        }

        // GET: api/TodoItems
        /// <summary>
        /// Retrieves all todo items that are not completed.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetTodoItems()
        {
            try
            {
                var results = await _todoService.GetIncompleteTodoItems();
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving todo items.");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/TodoItems/{id}
        /// <summary>
        /// Retrieves a specific todo item by ID.
        /// </summary>
        /// <param name="id">The ID of the todo item.</param>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTodoItem(Guid id)
        {
            try
            {
                var result = await _todoService.GetTodoItemById(id);

                if (result == null)
                {
                    _logger.LogWarning("Todo item with id {Id} not found.", id);
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving todo item with id {Id}.", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/TodoItems/{id}
        /// <summary>
        /// Updates a specific todo item.
        /// </summary>
        /// <param name="id">The ID of the todo item to update.</param>
        /// <param name="todoItem">The updated todo item object.</param>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(Guid id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest("ID mismatch");
            }

            try
            {
                var updated = await _todoService.UpdateTodoItem(id, todoItem);
                if (!updated)
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating todo item with id {Id}.", id);
                return StatusCode(500, "Internal server error");
            }

            return NoContent();
        }

        // POST: api/TodoItems
        /// <summary>
        /// Creates a new todo item.
        /// </summary>
        /// <param name="todoItem">The todo item to create.</param>
        [HttpPost]
        public async Task<IActionResult> PostTodoItem(TodoItem todoItem)
        {
            if (string.IsNullOrEmpty(todoItem?.Description))
            {
                return BadRequest("Description is required");
            }

            // Trim the description to avoid issues with leading or trailing spaces
            todoItem.Description = todoItem.Description.Trim();

            try
            {
                // Check for duplicate items based on trimmed and case-insensitive description (note only for incomplete items)
                var existingItems = await _todoService.GetIncompleteTodoItems();
                if (existingItems.Any(item => 
                    item.Description.Trim().Equals(todoItem.Description)))
                {
                    return Conflict("An incomplete item with the same description already exists.");
                }
                var createdItem = await _todoService.CreateTodoItem(todoItem);
                return CreatedAtAction(nameof(GetTodoItem), new { id = createdItem.Id }, createdItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new todo item.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
