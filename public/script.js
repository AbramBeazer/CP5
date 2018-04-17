var app = new Vue({
  el: '#app',
  data: {
    books: [],
    movies: [],
    games: [],
    token: "",
    drag: {},
    bookText: "",
    movieText: "",
    gameText: "",
  },
  created: function() {
//do login stuff, if successful, do getters.

    this.getBooks();
    this.getMovies();
    this.getGames();
  },
  filters: {
    
  },
  computed: {
  
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
        this.getBooks();
      	return true;
      }).catch(err => {
      });
    },
    addBook: function() {
      
      this.getBooks();
      this.bookText = "";
    },
    getMovies: function() {
      axios.get("api/movies/" + this.token).then(response => {
	this.movies = response.data;
	return true;
      }).catch(err => {
      });
    },
    saveMovies: function() {
      axios.post("api/movies/" + this.token, {
	movies: this.movies,
      }).then(response => {
	return true;
      }).catch(err => {
      });
    },
    clearMovies: function() {
      axios.delete("api/movies/" + this.token).then(response => {
        this.getMovies();
      	return true;
      }).catch(err => {
      });
    },
    addMovie: function() {

      this.getMovies();
      this.movieText = "";
    },
    getGames: function() {
      axios.get("api/games/" + this.token).then(response => {
	this.games = response.data;
	return true;
      }).catch(err => {
      });
    },
    saveGames: function() {
      axios.post("api/games/" + this.token, {
	games: this.games,
      }).then(response => {
	return true;
      }).catch(err => {
      });
    },
    clearGames: function() {
      axios.delete("api/games/" + this.token).then(response => {
        this.getGames();
      	return true;
      }).catch(err => {
      });
    },
    addGame: function() {
      
      this.getGames();
      this.gameText = "";
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(container, item) {
   /*
      let indexTarget = container.indexOf(item);
      let index = container.indexOf(this.drag);
      container.splice(index,1);
      container.splice(indexTarget,0,this.drag);
    */
    },
  }
});