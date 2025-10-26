const http = require("http");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const PORT = process.env.PORT || 5000;

const app = express();

// Body parser - MUST be early
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution - THIS WAS THE PROBLEM
// Either remove it or whitelist your query params
app.use(
  hpp({
    whitelist: [
      "select",
      "sort",
      "limit",
      "page",
      "averageCost",
      "averageRating",
    ],
  })
);

// Enable CORS
app.use(cors());

// File upload
app.use(fileUpload());

// Set Static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes - AFTER all middleware
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// Error handler - MUST be last
app.use(errorHandler);

// Export for Vercel
module.exports = app;

// Only listen if not in Vercel
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
        .yellow.bold
    );
  });

  // handle Unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Unhandled Rejection: ${err.message}`.red);
    // close server and exit
    server.close(() => {
      process.exit(1);
    });
  });
}
