var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require ('mongoose');

var PORT = 3000;

mongoose.connect("mongodb://localhost/my_child");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//SCHEMA setup

var settingSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Setting = mongoose.model("Setting", settingSchema);

// Setting.create(
//     {
//       name: 'The Orange Tree',
//       image: 'http://www.theorangetreedaynursery.co.uk/sites/all/themes/theme1140/img/logo-small.png',
//       description:'A wonderful newly set up nursery located in a rural area. Rated good by OFSTED.'
//     },
//     function(err, setting){
//       if(err){
//         console.log("err");
//       } else {
//         console.log("Newly created setting: ");
//         console.log(setting);
//       }
//     })

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
  Setting.findById(req.params.id, function(err, foundSetting){
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
