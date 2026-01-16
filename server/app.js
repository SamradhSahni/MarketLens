const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const indexRoutes = require("./routes/index.routes");
const mlTestRoutes = require("./routes/mltest.routes");
const predictionRoutes = require("./routes/prediction.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const correlationRoutes = require("./routes/correlation.routes");
const stocksRoutes = require("./routes/stock.routes");
const sectorRoutes = require("./routes/sector.routes");







const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true only in HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/index", indexRoutes);
app.use("/api", mlTestRoutes);
app.use("/api", predictionRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", correlationRoutes);
app.use("/api", stocksRoutes);
app.use("/api", sectorRoutes);


module.exports = app;
