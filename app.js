const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo');

const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
  secret: 'keyboard cow',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: process.env.DB_STRING })
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folders
app.use(express.static(path.join(__dirname
  , 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
