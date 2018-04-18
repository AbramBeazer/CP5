var app = new Vue({
  el: '#app',
  data: {
    books: [],
    movies: [],
    games: [],
    username: "",
    password: "",
    usernameEnter: "",
    passwordEnter: "",
    token: "",
    drag: {},
    dragType: "",
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
      return { headers: {'authorization': this.token}};
    }
  },
  methods: {
    getItems: function(type) {
      //console.log(this.authHeader.headers['authorization']);
     // console.log(type);
    //  console.log(this.username);
      axios.get("/api/titles/" + this.username + "/type/" + type).then(response => {
//	console.log("GOT BACK");
	if(type === 'book')
      		this.books = response.data.list;
	else if(type === 'movie')
		this.movies = response.data.list;
	else if(type === 'game')
		this.games = response.data.list;
      	return true;
      }).catch(err => {console.log(err);
      });
    },
    saveItems: function(type, container) {
      axios.post("/api/titles" + this.username, {
	       games: this.games,
    }, this.authHeader).then(response => {
	     return true;
      }).catch(err => {
      });
    },
    clearItems: function(type) {
	console.log(this.username);
	console.log(type);
      axios.delete("/api/titles/" + this.username + "/type/" + type).then(response => {
        this.getItems(type);
      	return true;
      }).catch(err => {
      });
    },
    addItem: function(type) {
      let text = "";
      let number = 0;      
      if(type === 'game'){text = this.gameText; number = this.games.length + 1;}
      else if(type === 'book'){text = this.bookText; number = this.books.length + 1;}
      else if(type === 'movie'){text = this.movieText; number = this.movies.length + 1;}
      if(number === 0){number = 1;}
      console.log(number);
      axios.post("/api/titles",
      {username: this.username, type: type, title: text, number: number}, this.authHeader).then(response => {
        console.log("Y");
        this.getItems(type).then(tf => {
          if(type === 'game'){this.gameText = "";}
          else if(type === 'book'){this.bookText = "";}
          else if(type === 'movie'){this.movieText = "";}
          return true;
      });
	}).catch(err => {});
    },
    dragItem: function(type, item) {
      this.drag = item;
      this.dragType = type;
    },
    dropItem: function(type, item) {
      if(this.dragType !== type){console.log("Not same type"); 
	this.drag = {};
        this.dragType = "";
	return;
      }
      
    },
    deleteItem: function(type, item) {
	console.log(this.username);
	console.log(item);
	axios.delete("/api/titles/"+item.title+"/username/"+this.username).then(response => {
          this.getItems(type);});      
    },
    login: function(){
      if(this.usernameEnter === '' || this.passwordEnter === '')
      {
        console.log("Please provide a username and password.");
        return;
      }
      axios.post("/api/login", {
        username: this.usernameEnter,
        password: this.passwordEnter,
      }).then(response => {
        this.token = response.data.token;
        this.username = this.usernameEnter;
        this.password = this.passwordEnter;
        this.headerMessage = "Rank your favorite things!";
        return true;
      }).then(result => {this.getItems('book', this.books); this.getItems('movie', this.movies); 
			this.getItems('game', this.games)}).catch(err => {});
    },
    register: function(){
      if(this.usernameEnter === '' || this.passwordEnter === '')
      {
        console.log("Please provide a username and password.");
        return;
      }
      axios.post("/api/register", {
        username: this.usernameEnter,
        password: this.passwordEnter,
      }).then(response => {
        this.token = response.data.token;
        this.username = this.usernameEnter;
        this.password = this.passwordEnter;
        this.headerMessage = "Rank your favorite things!";
        return true;
      }).then(result => {this.getItems('book', this.books); this.getItems('movie', this.movies); 
			this.getItems('game', this.games)}).catch(err => {});
    },
  }
});
