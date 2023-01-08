const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/wikiDB',{
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req, res){

  console.log("we are on home page");
  res.send("<h1> hello guys </h1>");

});

app.route("/articles")
.get((req, res)=>{
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      console.log(err);
    }

  });
})
.post((req, res)=>{
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Article is added into database successfully");
    }else{
      res.send(err);
    }
  });
})
.delete((req, res)=>{
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all the records from the documents.");
    }else{
      res.send(err);
    }
  });
});

app.route("/articles/:queryTitle")
.get((req, res)=>{
  //console.log(req.params.queryTitle);
  const getTitle = req.params.queryTitle;
  Article.findOne({title:getTitle},function(err, reult){
    if(!err){
      res.send(reult);
    }else{
      res.send(err);
    }
  });
})
.put((req, res)=>{
  Article.updateOne(
    {title: req.params.queryTitle},
    {
      title: req.body.title,
      content: req.body.content
    },
    function(err){
      if(!err){
        res.send("successfully updated the records");
      }
    });
})
.patch((req, res)=>{
  Article.update(
    {title: req.params.queryTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})
.delete((req, res)=>{
  Article.deleteOne({title: req.params.queryTitle}, function(err){
    if(!err){
      res.send("Article is deleted successfully");
    }else{
      res.send(err);
    }
  })
});


app.listen(process.env.PORT || 3000, function(req, res){
  console.log("server start at port 3000....");
});
