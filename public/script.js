var app = new Vue({
  el: '#app',
  data: {
    books: [],
    movies: [],
    games: [],
    token: "",
  },
  created: function() {
//do login stuff, if successful, do getters.

    this.getBooks();
    this.getMovies();
    this.getGames();
  },
  filters: {
    
  },
  methods: {
    getBooks: function() {
      axios.get("api/books/" + this.token).then(response => {
	this.books = response.data;
	return true;
      }).catch(err => {
      });
    },
    saveBooks: function() {
      axios.post("api/books/" + this.token, {
	books: this.books,
      }).then(response => {
	return true;
      }).catch(err => {
      });
    },
    clearBooks: function() {
      axios.delete("api/books/" + this.token).then(response => {
        this.getTickets();
      	return true;
      }).catch(err => {
      });
    },
  }
});