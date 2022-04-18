const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static('public'))
const Article=require('./models/articleSchema')
// for auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
}); 


//// mongoose

const mongoose = require('mongoose');
const { CLIENT_RENEG_LIMIT } = require('tls')
 
mongoose.connect("mongodb+srv://hoda:hoda123@cluster0.fymfe.mongodb.net/all-data?retryWrites=true&w=majority")
.then((result)=> {
    app.listen(port, () => {
        console.log(`Example app listening on port localhost:${port}`)
      })
})
.catch((err)=> {console.log(err)});
 

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/html')
})
app.get('/html', (req, res) => {
   
// result-> array of objects in mongo database
    Article.find()
    .then((result)=>{ res.render('index',{mytitle:"Home",arrArticle:result})})
    .catch((err)=>{console.log(err)})
  })

  app.post('/html', (req, res) => {
   const article = new Article(req.body);
    //console.log(req.body);
    article.save( )
    .then( result => { 
      res.redirect("/html");
    })
    .catch( err => {
      console.log(err);
    });
  })

  app.get("/add-new-article", (req, res) => {
    res.render("add-new-article",{mytitle:"Add Article"})
  });

 
 app.get("/article-details" , (req,res)=>{

 // res.render("details",{mytitle:"Article Details",arrArticle:result})
 Article.findById("625c5d51f536a00d0a1d744c")
 .then((result)=>{ res.render("details",{mytitle:"Article Details",objArticle:result})})
 .catch((err)=>{console.log(err)})
})

app.get("/:id",(req,res)=>{
    Article.findById(req.params.id)
    .then((result)=>{ res.render("details",{mytitle:"Article Details",objArticle:result})})
    .catch((err)=>{console.log(err)})
})

app.delete("/:id", (req, res) => {
  Article.findByIdAndDelete(req.params.id)

    .then((params) => {
   res.json({ myname:"hoda"})
    })

    .catch((err) => {
      console.log(err);
    });
});
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })


