// "mongodb+srv://varun:varunecom@cluster0.nvzihu3.mongodb.net/ecom"

const express = require("express");
const server = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./model/User");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json());
server.use("/products", productsRouter.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/users", usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", ordersRouter.router);

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username }).exec();

      console.log({ user });
      if (!user) {
        return done(null, false, { message: "No such Email exists" });
      } else if (user.password !== password) {
        return done(null, false, { message: "Wrong Password" });
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://varun:varunecom@cluster0.nvzihu3.mongodb.net/ecom"
  );
  console.log("database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server started");
});
