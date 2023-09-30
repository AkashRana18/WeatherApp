require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/user');
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        require('dotenv').config();

      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  mongoose.set('strictQuery', true);
  

  const static_path = path.join(__dirname, "public");
  const template_path = path.join(__dirname, "templates/views");
const partials_path = path.join(__dirname, "templates/partials");

app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false }));


app.use(session({
    secret: '1642dcfa86f18c76e8ed4f05162d1058ea9109757e8682498cb45e592b82fd95',
    resave: true,
    saveUninitialized: true
}));


const secretKey = crypto.randomBytes(32).toString('hex');
// console.log("Secret Key:", secretKey);

// Middleware to check if the user is authenticated
const authenticateMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/signup');
};


//route for signup

app.get("/signup", (req, res) => {
    res.render('signup');
});

// Route to handle the signup form submission
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('login', { error: 'Email already registered' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        console.log("User created:", email);
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error.message);


    }

});

// Route to render the login form
app.get("/login", (req, res) => {
    res.render('login');
});

// Route to handle the login form submission
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hash) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Store user session
        req.session.user = user;
        res.redirect('/weather');
    } catch (error) {
        res.status(500).send(error.message);
        console.log("User logged in:", email);
    }
});

// Route to handle user logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error while logging out:", err);
            return res.redirect("/weather");
        }
        res.redirect("/login");
    });
});

// Route to render the home page

app.get("/", (req, res) => {
    res.render('index');
});

// Render the about page

app.get("/about", (req, res) => {
    res.render('about');
});

// Render the weather page

app.get("/weather", authenticateMiddleware, (req, res) => {
    res.render('weather');

});

// Render the 404 page for any other routes not defined above

app.get('*', (req, res) => {
    res.render('404'); // Render the 404 page for any other routes not defined above
});

// Start the server on port 3000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening to port http://localhost:3000");
    })
}).catch((err) => {
    console.log(err);
}
);

