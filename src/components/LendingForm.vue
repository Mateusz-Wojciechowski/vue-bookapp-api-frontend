<template>
  <div>
    <h3>{{ formTitle }}</h3>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Book ID:</label>
        <input 
          type="text" 
          v-model="lending.bookId" 
          required 
          placeholder="Enter book ID"
        />
      </div>
      <div>
        <label>Reader ID:</label>
        <input 
          type="text" 
          v-model="lending.readerId" 
          required 
          placeholder="Enter reader ID"
        />
      </div>
      <button type="submit">{{ submitButtonText }}</button>
      <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LendingForm',
  props: {
    editLending: { type: Object, default: null }
  },
  data() {
    return {
      lending: {
        id: null,
        bookId: '',
        readerId: '',
        lendingDate: ''
      },
      errorMessage: ''
    }
  },
  computed: {
    isEditing() {
      return this.editLending !== null;
    },
    formTitle() {
      return this.isEditing ? 'Edit Lending' : 'Add New Lending';
    },
    submitButtonText() {
      return this.isEditing ? 'Update Lending' : 'Add Lending';
    }
  },
  watch: {
    editLending: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.lending = {
            id: newVal.id,
            bookId: newVal.book?.id || '',
            readerId: newVal.reader?.id || '',
            lendingDate: newVal.lendingDate
          }
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.lending = {
        id: null,
        bookId: '',
        readerId: '',
        lendingDate: ''
      };
      this.errorMessage = '';
    },
    isValidId(id) {
      return !isNaN(id) && Number(id) > 0;
    },
    validateForm() {
      if (!this.isValidId(this.lending.bookId)) {
        this.showError('Book ID must be a valid number');
        return false;
      }
      
      if (!this.isValidId(this.lending.readerId)) {
        this.showError('Reader ID must be a valid number');
        return false;
      }
      
      return true;
    },
    showError(message) {
      alert(message);
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      
      try {
        const payload = {
          id: this.lending.id,
          lendingDate: this.lending.lendingDate,
          book: { id: Number(this.lending.bookId) },
          reader: { id: Number(this.lending.readerId) }
        };
        
        this.$emit(this.isEditing ? 'lending-updated' : 'lending-added', payload);
        this.resetForm();
      } catch (error) {
        this.showError(`Error: ${error.message}`);
      }
    },
    cancelEdit() {
      this.resetForm();
      this.$emit('cancel-edit');
    }
  }
}
</script>

<style scoped>
label {
  display: inline-block;
  width: 100px;
}
input, select {
  width: 200px;
  padding: 0.5rem;
}
form > div {
  margin-bottom: 1rem;
}
</style>