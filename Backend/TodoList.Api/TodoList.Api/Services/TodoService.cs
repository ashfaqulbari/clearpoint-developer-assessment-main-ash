using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TodoList.Api.Models;

/// <summary>
/// Service class for handling business logic related to Todo items.
/// </summary>

namespace TodoList.Api.Services
{
    public class TodoService : ITodoService
    {
        private readonly TodoContext _context;

        public TodoService(TodoContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all incomplete todo items.
        /// </summary>
        /// <returns>A list of incomplete todo items.</returns>
        public async Task<IEnumerable<TodoItem>> GetIncompleteTodoItems()
        {
            return await _context.TodoItems.Where(x => !x.IsCompleted).ToListAsync();
        }

        /// <summary>
        /// Retrieves a specific todo item by ID.
        /// </summary>
        /// <param name="id">The ID of the todo item.</param>
        /// <returns>The todo item with the specified ID.</returns>
        public async Task<TodoItem> GetTodoItemById(Guid id)
        {
            return await _context.TodoItems.FindAsync(id);
        }

        /// <summary>
        /// Updates a specific todo item.
        /// </summary>
        /// <param name="id">The ID of the todo item to update.</param>
        /// <param name="todoItem">The updated todo item object.</param>
        /// <returns>True if the update was successful, otherwise false.</returns>
        public async Task<bool> UpdateTodoItem(Guid id, TodoItem todoItem)
        {
            _context.Entry(todoItem).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Creates a new todo item.
        /// </summary>
        /// <param name="todoItem">The todo item to create.</param>
        /// <returns>The created todo item.</returns>
        public async Task<TodoItem> CreateTodoItem(TodoItem todoItem)
        {
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();
            return todoItem;
        }

        /// <summary>
        /// Checks if a todo item exists by ID.
        /// </summary>
        /// <param name="id">The ID of the todo item.</param>
        /// <returns>True if the todo item exists, otherwise false.</returns>
        private bool TodoItemExists(Guid id)
        {
            return _context.TodoItems.Any(x => x.Id == id);
        }
    }
}
