<template>
  <div>
    <h3>{{ formTitle }}</h3>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Title:</label>
        <input v-model="book.title" type="text" required />
      </div>
      <div>
        <label>Pages:</label>
        <input v-model.number="book.pages" type="number" required />
      </div>
      <div>
        <label>Author:</label>
        <select v-model.number="book.authorId" required>
          <option disabled value="0">Select an author</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>
      <button type="submit">{{ submitButtonText }}</button>
      <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'BookForm',
  props: {
    editBook: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      book: {
        id: null,
        title: '',
        pages: 0,
        authorId: 0  // domyślnie 0 oznacza brak wybranego autora
      },
      authors: []
    }
  },
  computed: {
    isEditing() {
      return this.editBook !== null;
    },
    formTitle() {
      return this.isEditing ? 'Edit Book' : 'Add New Book';
    },
    submitButtonText() {
      return this.isEditing ? 'Update Book' : 'Add Book';
    }
  },
  watch: {
    editBook: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.book = {
            id: newVal.id,
            title: newVal.title,
            pages: newVal.pages,
            authorId: newVal.author ? newVal.author.id : 0
          }
        } else {
          this.resetForm();
        }
      }
    }
  },
  mounted() {
    this.fetchAuthors();
  },
  methods: {
    fetchAuthors() {
      fetch('/api/authors')
        .then(response => response.json())
        .then(data => {
          this.authors = data.content;
          console.log('Fetched authors:', data);
        })
        .catch(error => {
          console.error('Error fetching authors:', error);
        });
    },
    resetForm() {
      this.book = {
        id: null,
        title: '',
        pages: 0,
        authorId: 0
      }
    },
    handleSubmit() {
      if (this.book.authorId === 0) {
        alert("Please select an author");
        return;
      }
      // Tworzymy payload do wysłania do backendu, wysyłając obiekt author z kluczem id
      const payload = {
        id: this.book.id,
        title: this.book.title,
        pages: this.book.pages,
        author: {
          id: this.book.authorId
        }
      }
      if (this.isEditing) {
        this.$emit('book-updated', payload);
      } else {
        this.$emit('book-added', payload);
      }
      this.resetForm();
    },
    cancelEdit() {
      this.resetForm();
      this.$emit('cancel-edit');
    }
  }
}
</script>

<style scoped>
form {
  margin-bottom: 2rem;
}
div {
  margin-bottom: 1rem;
}
label {
  display: inline-block;
  width: 100px;
}
input, select {
  padding: 0.5rem;
  width: 200px;
}
button {
  margin-right: 0.5rem;
}
</style>
