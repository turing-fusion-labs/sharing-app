//EXpress Config
var express = require('express'),
    app = express(),
    //port = process.env.PORT || 7000,
    Datastore = require('nedb'),
    // Item = require('./api/model/tfsitemmodel'),
    // User = require('./api/model/tfsusermodel'),//created model loading here
    bodyParser = require('body-parser');

//DB config
var User = new Datastore();
var Item = new Datastore();
app.use( express.static( "icons" ) );

var admin = {
  username: 'admin',
  password: 'admin'
};

//Initial Data setup
User.insert(admin, function(err, user) {
  console.log('Inserted', user.username, 'with ID', user._id);
});

//EJS
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.listen(port);
app.listen(7000);

// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });

//Services

app.get('/', function(req, res) {
  res.render('pages/login');
});



app.get('/login', function(req, res) {
  console.log(req.query.username);
  User.findOne({username:req.query.username,password:req.query.password}, function(err, user) {
    console.log(user);
    if (err || user == null) {
      res.render('pages/login', {
        message: "Invalid user name or password"
      });
    }
    res.locals.user = user;
    Item.find({}, function(err, items) {
      if(err)
        items = [];
      res.render('pages/dashboard', {
        items: items
      });
    });
  });

  app.get('/addItem', function(req, res) {
    // res.locals.user = req.session.user;
    res.render('pages/addItem');
  });

  app.post('/itemSubmit', function(req, res) {
    console.log(req.locals);
    // res.locals.user = req.session.user;
    Item.insert(req.body, function(err, item) {
      if (err || item == null) {
        res.render('pages/addItem', {
          message: "Adding item failed"
        });
      }
      Item.find({}, function(err, items) {
        if(err)
          items = [];
        res.render('pages/dashboard', {
          items: items
        });
      });
    });
  });

});


console.log('TFS RESTful API server started on: ' + 7000);