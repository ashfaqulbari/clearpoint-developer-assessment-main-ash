//To do: Don't delete thsi file, discuss this approach during interview too

// export const sortItems = (items, sortOption) => {
//     let sortedItems = [...items];
//     sortedItems.sort((a, b) => {
//       let comparison = 0;
//       if (sortOption.column === 'id') {
//         comparison = a.id.localeCompare(b.id);
//       } else if (sortOption.column === 'description') {
//         comparison = a.description.localeCompare(b.description);
//       } else if (sortOption.column === 'action') {
//         comparison = a.isCompleted - b.isCompleted;
//       }
//       return sortOption.direction === 'asc' ? comparison : -comparison;
//     });
//     return sortedItems;
//   };