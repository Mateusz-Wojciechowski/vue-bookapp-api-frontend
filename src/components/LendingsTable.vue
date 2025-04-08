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
          <td>{{ lending.book ? lending.book.title : '' }}</td>
          <td>{{ lending.reader ? lending.reader.name : '' }}</td>
          <td>{{ lending.lendingDate }}</td>
          <td class="action-buttons">
            <button @click="$emit('delete-lending', lending.id)">Return</button>
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
  name: 'LendingsTable',
  props: {
    lendings: {
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
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}
.action-buttons {
  display: flex;
  gap: 0.5rem;
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
