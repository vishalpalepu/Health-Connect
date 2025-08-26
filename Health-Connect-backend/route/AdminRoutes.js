const express = require("express");
const {
  HandleLoginController,
  HandleRegisterController,
  HandleDeleteUserController,
} = require("../controller/AdminCtrl");
const Router = express.Router(); // Initialize a new router instance

// Define routes on the Router instance
Router.post("/login", HandleLoginController);
Router.post("/register", HandleRegisterController);
Router.post("/deleteUser", HandleDeleteUserController);

module.exports = Router; // Export the router instance directly
