/* 
Jay Pittenger

*/

var express = require('express');
var mysql = require('mysql');

// setup pool for database
var pool = mysql.createPool({

  // ENTER DATABASE INFORMATION HERE
  //host  : '',
  //user  : '',
  //password : '',
  //database : ''
});

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// include static files
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// Initial Load
app.get('/',function(req,res){
  res.render('home');
});

// Insert into database
app.get('/insert',function(req,res,next){
    var context = {};
    var queryString = "INSERT INTO vote(`roomnum`, `photovote`) VALUES (?, ?)";
    var valueArray = [req.query.roomnum, req.query.photovote];

    // insert request to database
    pool.query(queryString, valueArray, function(err, result){
    if(err){
        next(err);
        return;
      }
      context.results = "Inserted id " + result.insertId;
      res.send(context);
    });
});

// Select from database
app.get('/select',function(req,res,next){
    var context = {};
    pool.query('SELECT * FROM vote', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      // send selected content back to client
      res.send(context);
    });
  });

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen((process.env.PORT || 5000), function(){
  console.log('Express started on http://localhost:' + 5000 + '; press Ctrl-C to terminate.');
});