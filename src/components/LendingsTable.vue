<template>
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Reader</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lending in lendings" :key="lending.id">
            <td>{{ lending.id }}</td>
            <td>{{ lending.book?.title || '' }}</td>
            <td>{{ lending.reader?.name || '' }}</td>
            <td>{{ lending.lendingDate }}</td>
            <td>
              <button @click="$emit('edit-lending', lending)">Edit</button>
              <button @click="$emit('delete-lending', lending.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LendingsTable',
    props: {
      lendings: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 0.5rem;
  }
  </style>