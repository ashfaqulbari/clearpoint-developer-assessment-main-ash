
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoList.Api.Models;

namespace TodoList.Api.Services
{
    /// <summary>
    /// Interface for TodoService to handle business logic for Todo items.
    /// </summary>
    public interface ITodoService
    {
        /// <summary>
        /// Retrieves all incomplete todo items.
        /// </summary>
        /// <returns>A list of incomplete todo items.</returns>
        Task<IEnumerable<TodoItem>> GetIncompleteTodoItems();

        /// <summary>
        /// Retrieves a specific todo item by ID.
        /// </summary>
        /// <param name="id">The ID of the todo item.</param>
        /// <returns>The todo item with the specified ID.</returns>
        Task<TodoItem> GetTodoItemById(Guid id);

        /// <summary>
        /// Updates a specific todo item.
        /// </summary>
        /// <param name="id">The ID of the todo item to update.</param>
        /// <param name="todoItem">The updated todo item object.</param>
        /// <returns>True if the update was successful, otherwise false.</returns>
        Task<bool> UpdateTodoItem(Guid id, TodoItem todoItem);

        /// <summary>
        /// Creates a new todo item.
        /// </summary>
        /// <param name="todoItem">The todo item to create.</param>
        /// <returns>The created todo item.</returns>
        Task<TodoItem> CreateTodoItem(TodoItem todoItem);
    }
}
