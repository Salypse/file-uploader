require("dotenv").config();

const express = require("express");
const path = require("node:path");
const app = express();

const passport = require("./config/passport");

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma");

const indexRouter = require("./routes/indexRouter");
const loginRouter = require("./routes/loginRouter");
const signUpRouter = require("./routes/signUpRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // Remove cookies after 14 days
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

//Allows user property in ejs files
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/sign-up", signUpRouter);

//404 Not Found error handler
app.use((req, res) => {
  res
    .status(404)
    .render("errorPage", { message: "Page Not Found", statusCode: 404 });
});

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).render("errorPage", {
    message: err.message || "Something went wrong",
    statusCode: statusCode,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on Port: ${PORT}`);
});
