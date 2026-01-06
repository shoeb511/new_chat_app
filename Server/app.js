const express = require("express");

const path = require("path");

const authRoutes = require("./routes/auth.routes");

// const messageHandlerRoutes = require("./routes/messageHandler.routes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

// app.use("/mh", messageHandlerRoutes);

app.use(express.static(path.join(__dirname, "../Client")));

module.exports = app;