const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const passport = require('passport');
const session = require('express-session')

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
// app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
// app.set('view engine', '.hbs')
// app.set('views', './views');



// app.engine('.hbs', handlebars.engine({ defaultLayout: 'main', extname: '.hbs' }));
// // app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set("views", "./views");

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
  saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folders
app.use(express.static(path.join(__dirname
  , 'public')));

// Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
