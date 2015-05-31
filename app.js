// set up stuff
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var uristring = 'mongodb://mango:hanna0501@ds041432.mongolab.com:41432/heroku_app37347469'; 

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connecting to: ' + uristring);
  }
});

// declare Todo model in mongoose/mongoDB
var Todo = mongoose.model('Todo', {
    text : String,
    done : Boolean
});

// display todos
app.get('/todos', function(request, response) {
    Todo.find(function(error, todos) {
        if (error)
            response.send(error)
        response.json(todos);
    });
});

// create todo and respond with all todos
app.post('/todos', function(request, response) {
    Todo.create({
        text : request.body.text,
        done : false
    }, function(error, todo) {
        if (error)
            response.send(error);

        Todo.find(function(error, todos) {
            if (error)
                response.send(error)
            response.json(todos);
        });
    });

});

// update todo and respond with all todos
app.put('/todos/:todo_id', function(request, response) {
    Todo.findByIdAndUpdate( request.params.todo_id,  request.body, function(error, todo) {
            if (error)
                response.send(error);

            Todo.find(function(error, todos) {
                if (error)
                    response.send(error)
                response.json(todos);
            });
        }
    ); 
})

// delete a todo
app.delete('/todos/:todo_id', function(request, response) {
    Todo.remove({
        _id : request.params.todo_id
    }, function(error, todo) {
        if (error)
            response.send(error);

        Todo.find(function(error, todos) {
            if (error)
                response.send(error)
            response.json(todos);
        });
    });
});

// load index.html as main page
app.get('*', function(request, response) {
    response.sendfile('./public/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

module.exports = app;
