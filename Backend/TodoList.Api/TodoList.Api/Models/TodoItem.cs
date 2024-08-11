using System;

namespace TodoList.Api.Models
{
    /// <summary>
    /// Represents a Todo item with properties for ID, description, and completion status.
    /// </summary>
    public class TodoItem
    {
        /// <summary>
        /// Gets or sets the unique identifier for the Todo item.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the description of the Todo item.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the Todo item is completed.
        /// </summary>
        public bool IsCompleted { get; set; }
    }
}
