<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reader in readers" :key="reader.id">
          <td>{{ reader.id }}</td>
          <td>{{ reader.name }}</td>
          <td class="action-buttons">
            <button @click="$emit('edit-reader', reader)">Edit</button>
            <button @click="$emit('delete-reader', reader.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination" v-if="totalPages > 1">
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="$emit('change-page', page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadersTable',
  props: {
    readers: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
.pagination button {
  margin-right: 0.25rem;
  padding: 0.5rem 1rem;
}
.pagination button.active {
  background-color: #009435;
  color: white;
}
</style>
