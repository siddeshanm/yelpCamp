if (process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}



const express = require('express')
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const engine = require('ejs-mate')
const session = require('express-session')
const joi =  require('joi')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const { isLoggedIn } = require('./routes/middleware')



const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({extended : true }))
app.use(methodOverride('_method'))
app.engine('ejs', engine)
app.use(express.static( path.join(__dirname, 'public')))



  


const sessionConfig = {
   secret : 'thisismysecret',
   resave : false ,
   saveUninitialized : true,
   cookie : {
    httpOnly : true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge : 1000 * 60 * 60 * 24 * 7
   }
   
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))



passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('SUCCESSFULLY CONNECTED TO DB')
}


app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.whoUser = req.user
  next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
  const{ status = 500} = err
  if(!err.message)  err.message = "Something Went Wrong!!!!"
  res.status(status).render('error', {err})
})

app.listen(3000, () => {
    console.log("Hey I'M Listening to 3000")
})