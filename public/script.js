var app = new Vue({
  el: '#app',
  data: {
    books: [],
    movies: [],
    games: [],
    username: "",
    password: "",
    token: "",
    drag: {},
    bookText: "",
    movieText: "",
    gameText: "",
    headerMessage: "Please Login or Register to begin.",
  },
  created: function() {
//do login stuff, if successful, do getters.
    //
    // this.getBooks();
    // this.getMovies();
    // this.getGames();
  },
  filters: {

  },
  computed: {
    authHeader: function(){
      return { headers: {'Authorization': token}};
    }
  },
  methods: {
    getBooks: function() {
      axios.get("/api/books/" + this.username, authHeader).then(response => {
	this.books = response.data;
	return true;
      }).catch(err => {
      });
    },
    saveBooks: function() {
      axios.post("/api/books/" + this.username, {
	books: this.books,
      }, authHeader).then(response => {
	return true;
      }).catch(err => {
      });
    },
    clearBooks: function() {
      axios.delete("/api/books/" + this.username, authHeader).then(response => {
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
      axios.get("/api/movies/" + this.username, authHeader).then(response => {
	this.movies = response.data;
	return true;
      }).catch(err => {
      });
    },
    saveMovies: function() {
      axios.post("/api/movies/" + this.username, {
	        movies: this.movies,
      }, authHeader).then(response => {
	       return true;
      }).catch(err => {
      });
    },
    clearMovies: function() {
      axios.delete("/api/movies/" + this.username, authHeader).then(response => {
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
      axios.get("/api/games/" + this.username, authHeader).then(response => {
	this.games = response.data;
	return true;
      }).catch(err => {
      });
    },
    saveGames: function() {
      axios.post("/api/games/" + this.username, {
	games: this.games,
}, authHeader).then(response => {
	return true;
      }).catch(err => {
      });
    },
    clearGames: function() {
      axios.delete("/api/games/" + this.username, authHeader).then(response => {
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
      let indexTarget = container.indexOf(item);
      let index = container.indexOf(this.drag);
      container.splice(index,1);
      container.splice(indexTarget,0,this.drag);
    },
    deleteItem: function(container, item) {
      let index = container.indexOf(item);
      container.splice(index, 1);
    },
    login: function(){
      if(this.username === '' || this.password === '')
      {
        console.log("Please provide a username and password.");
        return;
      }
      axios.post("/api/login", {
        username: this.username,
        password: this.password,
      }).then(response => {
        this.token = response.data.token;
        this.headerMessage = "Enter your favorite things and then drag and drop them around as you want!";
        return true;
      }).catch(err => {});
    },
    register: function(){
      if(this.username === '' || this.password === '')
      {
        console.log("Please provide a username and password.");
        return;
      }
      axios.post("/api/register", {
        username: this.username,
        password: this.password,
      }).then(response => {
        this.token = response.data.token;
        this.headerMessage = "Enter your favorite things and then drag and drop them around as you want!";
        return true;
      }).catch(err => {});
    },
  }
});
