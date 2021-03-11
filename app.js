const express = require('express');
const path = require('path')
const passport = require('passport')
const session = require('express-session')
//store session in database
const MongoStore = require('connect-mongo').default;
const app = express();
const connectDB = require('./config/db')
// const http = require('http');
const morgan = require('morgan')
const finalhandler = require('finalhandler')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const Mongoose = require('mongoose');
const { url } = require('inspector');
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// if(process.env.NODE_ENV === 'development'){
//     app.use(morgon('dev'))
// }

//passport config
require('./config/passport')(passport)


// Body Parser

app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//handlebars Helpers
const {formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//handlebars
app.engine('.hbs', 
  exphbs({
    helpers:{
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    }, 
    defaultLayout:'main',
    extname: '.hbs'}));


app.set('view engine', '.hbs');

//session configuration
const mongoStore = MongoStore.create({
  mongoUrl: 'mongodb+srv://dipaligojre:Uninor9890@cluster0.f8xea.mongodb.net/storybooks?retryWrites=true&w=majority',
  collectionName: "sessions",
});

//sessions
app.use(session({
    secret: 'process.env.COOKIE_SECRET',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //cookie valid for 24 hours
  }))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use(function(req, res, next){
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


//call database

connectDB();

// create "middleware"
var logger = morgan('combined')



// const server = http.createServer((req, res) => {
 
//     // respond to request
//     res.setHeader('content-type', 'text/plain')
//     res.write('Welcome !!\n')
//     res.end('End')
//     })

app.listen(port, () => {
console.log(`server listening on host: ${hostname} port: ${port}`);
});






    // "dev": "env-cmd -f ./config/dev.env nodemon app.js"
