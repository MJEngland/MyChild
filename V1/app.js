var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require ('mongoose');
var Setting    = require ('./models/setting');
var seedDB     = require ('./seeds')
// var Comment    = require ('./modles/comment');
// var User       = require ('./modles/user');

var PORT = 3000;


mongoose.connect("mongodb://localhost/my_child");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

seedDB();

app.get('/', function(req, res){
  res.render('landing');
});

//INDEX Route - Show all settings
app.get('/settings', function(req, res){
//Get all settings from DB
Setting.find({}, function(err, allSettings){
  if (err){
    console.log(err);
  } else {
    res.render('index', {settings:allSettings});
  }
})
});

//CREATE Route - Add new setting to DB
app.post('/settings', function(req, res){
  //get data from form and add to settings array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newSetting ={name: name, image: image, description: desc}
  //Create a new setting and save to database
  Setting.create(newSetting, function(err, newlyCreated){
    if (err){
      console.log(err);
    } else {
      //redirect to settings Page
      res.redirect("/settings");
    }
  });
});

//NEW Route - Show new form to create new setting
app.get('/settings/new', function(req, res){
  res.render('new.ejs');
});

//SHOW Route - Shows individual setting information
app.get("/settings/:id", function(req, res){
  //Find the setting with the provided ID
  Setting.findById(req.params.id).populate("comments").exec(function(err, foundSetting){
    if(err){
      console.log(err)
    } else {
      //render show template with that setting
      res.render("show", {setting: foundSetting});
    }
  });
});

app.listen(PORT, function(){
  console.log("I am listening on port " + PORT);
});
