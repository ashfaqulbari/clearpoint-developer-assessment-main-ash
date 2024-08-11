using Microsoft.EntityFrameworkCore;
using TodoList.Api.Models;

namespace TodoList.Api
{
    /// <summary>
    /// Represents the database context for the Todo application.
    /// Inherits from DbContext to manage database operations related to Todo items.
    /// </summary>
    public class TodoContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the TodoContext class with the specified options.
        /// </summary>
        /// <param name="options">The options to be used by the DbContext.</param>
        public TodoContext(DbContextOptions<TodoContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Gets or sets the DbSet for TodoItems, representing the collection of Todo items in the database.
        /// </summary>
        public DbSet<TodoItem> TodoItems { get; set; }
    }
}