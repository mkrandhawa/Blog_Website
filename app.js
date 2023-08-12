//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose"); //requiring mongoose for storing the data into the DB 

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();

/****************************************MOGOOSE******************************************* */
// Connection  to mongo DB
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});
mongoose.connect("mongodb+srv://mkrandhawa25020:test123@cluster0.zqem7jz.mongodb.net/blogDB"); // connecting to online db server

//Schema for the DB
const postSchema= new mongoose.Schema({
  title: String,
  content: String
});

//Mongoose Model 

const Post= mongoose.model("Post", postSchema);


/******************************************************************************************** */


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



//Rendering the posts created in the compose page 
app.get("/", function(req, res){
  
  Post.find({}).then(function(foundPosts){ 
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    });
  }).catch(function(err) { // Handle errors
    console.error("Error fetching posts:", err);
    res.render("home", {
      startingContent: homeStartingContent,
      posts: [] // Send an empty array if there was an error to avoid potential rendering issues in the template
    });
  });

});

// Assuming 'lodash' and 'Post' are properly defined and imported

app.get("/posts/:postId", function(req, res) {
  const requestPostId = req.params.postId;

  Post.findOne({ _id: requestPostId }).then((post) => {
    if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
    } 
  }).catch((err) => {
    console.log("Error occurred:", err);
    // You might want to handle this case differently, maybe render an error page or redirect
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  //post document using mongoose model
  const post = new Post ({
    title:req.body.postTitle, //stores the content for the given title
    content:req.body.postBody //stores the content for the post body
  });
  //saving the document on the DB 
  post.save();
  res.redirect("/");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started on port 3000");
});
