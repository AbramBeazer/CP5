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
      return { headers: {'Authorization': this.token}};
    }
  },
  methods: {
    getItems: function(type, container) {
      axios.get("/api/titles", {type: type, username: this.username}, this.authHeader).then(response => {
      	container = response.data.list;
      	return true;
      }).catch(err => {
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
    clearItems: function() {
      axios.delete("/api/titles" + this.username, this.authHeader).then(response => {
        this.getGames();
      	return true;
      }).catch(err => {
      });
    },
    addItem: function(type, container) {
      let text = "";
      let number = container.length;
      if(type === 'game'){text = this.gameText;}
      else if(type === 'book'){text = this.bookText;}
      else if(type === 'movie'){text = this.movieText;}
      axios.put("/api/titles",
      {username: this.username, type: type, title: text, number: number}, this.authHeader);
      this.getItems(type, container);
      if(type === 'game'){this.gameText = "";}
      else if(type === 'book'){this.bookText = "";}
      else if(type === 'movie'){this.movieText = "";}
    },
    dragItem: function(type, item) {
      this.drag = item;
      this.dragType = type;
    },
    dropItem: function(container, item) {
      if(this.dragType !== container){console.log("Not same type"); return;}
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
        this.headerMessage = "Enter your favorite things and then drag and drop them around as you want!";
        return true;
      }).catch(err => {});
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
        this.headerMessage = "Enter your favorite things and then drag and drop them around as you want!";
        return true;
      }).catch(err => {});
    },
  }
});
