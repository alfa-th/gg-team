const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const autoIncrement = require("mongoose-auto-increment");
const MongoStore = require('connect-mongo')(session);
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
 
var app = express();

const db = require("./config/keys.js").MongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Database Connection Is Successful"))
  .catch(err => console.log(err));

autoIncrement.initialize(mongoose);

app.use(cookieParser('kunci rahasia sesi'));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    name: "sid",
    secret: "kunci rahasia sesi",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true
    }
  })
);

// app.use(express.cookieParser('kunci rahasia flash'));
app.use(flash());
// Serve Logger Middleware
//app.use(logger);

// Serve Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Gamers API Route
app.use("/api/teams", require("./routes/api/teams.js"));
app.use("/", require("./routes/index.js"));
app.use("/login", require("./routes/login.js"));
app.use("/register", require("./routes/register.js"));
app.use("/dashboard", require("./routes/dashboard.js"));
app.use("/search", require("./routes/search.js"));
app.use("/teams", require("./routes/teams.js"));
app.use("/debug", require("./routes/debug.js"));

const PORT = process.env.PORT || 5000;

// Serve Static Folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Server started in port", PORT);
});
