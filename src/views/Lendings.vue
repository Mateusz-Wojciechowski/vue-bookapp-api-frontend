<template>
  <div>
    <h2>Lendings Management</h2>
    <lending-form 
      @lending-added="handleLendingAdded"
      :edit-lending="editLending"
      @cancel-edit="cancelEdit"
    />
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!lendingsPage || lendingsPage.content.length === 0" class="no-data-message">
      No lendings to display
    </div>
    <lendings-table 
      v-else
      :lendings="lendingsPage.content"
      :current-page="currentPage"
      :total-pages="totalPages"
      @delete-lending="handleDeleteLending"
      @change-page="changePage"
    />
  </div>
</template>

<script>
import LendingForm from '@/components/LendingForm.vue'
import LendingsTable from '@/components/LendingsTable.vue'

export default {
  name: 'LendingsView',
  components: { LendingForm, LendingsTable },
  data() {
    return {
      lendingsPage: null,
      currentPage: 1,
      pageSize: 5,
      editLending: null,
      error: null
    }
  },
  computed: {
    totalPages() {
      return this.lendingsPage ? this.lendingsPage.totalPages : 0;
    }
  },
  methods: {
    async fetchLendings() {
      try {
        this.error = null;
        const response = await fetch(`/api/lendings?page=${this.currentPage - 1}&size=${this.pageSize}`);
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Database connection error") {
            throw new Error(errorData.message || `Error ${response.status}`);
          }else{
            alert(errorData.message)
          }
        }
        this.lendingsPage = await response.json();
      } catch (error) {
        console.error('Error fetching lendings:', error);
        this.error = error.message || 'Error fetching lendings';
      }
    },
    async handleLendingAdded(lending) {
      try {
        const readerCheckResponse = await fetch(`/api/readers/${lending.reader.id}`);

        if (readerCheckResponse.status === 404) {
          alert('Reader not found');
          return;
        }

        if (!readerCheckResponse.ok) {
          const errorData = await readerCheckResponse.json();
          throw new Error(errorData.message || `Error ${readerCheckResponse.status}`);
        }
        this.error = null;

        const response = await fetch(`/api/lendings/lend?bookId=${lending.book.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lending.reader)
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Database connection error") {
            throw new Error(errorData.message || `Error ${response.status}`);
          }else{
            alert(errorData.message)
          }
        }
        this.currentPage = 1;
        await this.fetchLendings();
      } catch (error) {
        console.error('Error adding lending:', error);
        this.error = error.message || 'Error adding lending';
      }
    },
    async handleDeleteLending(lendingId) {
      try {
        this.error = null;
        const response = await fetch(`/api/lendings/return?lendingId=${lendingId}`, { 
          method: 'POST' 
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        await this.fetchLendings();
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      } catch (error) {
        console.error('Error deleting lending:', error);
        this.error = error.message || 'Error deleting lending';
      }
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchLendings();
    },
    cancelEdit() {
      this.editLending = null;
    }
  },
  mounted() {
    this.fetchLendings();
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid red;
  border-radius: 4px;
  background-color: #ffeeee;
  text-align: center;
}
.no-data-message {
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  text-align: center;
  font-style: italic;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
.page-button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}
.page-button[disabled] {
  background-color: #eee;
  cursor: not-allowed;
}
</style>
