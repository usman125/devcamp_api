const http = require("http");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
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

const fs = require("fs");

const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");

// const swaggerDocument = YAML.parse(
//   fs.readFileSync(
//     path.join(__dirname, "subkontinent-Devcamper-1.0.0-local.yaml"),
//     "utf8"
//   )
// );

const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevCamper API",
      version: "1.0.0",
      description: "DevCamper Bootcamp API",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? `https://${process.env.VERCEL_URL}`
            : `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
    tags: [
      {
        name: "bootcamps crud",
      },
      {
        name: "courses crud",
      },
      {
        name: "authentication",
      },
      {
        name: "users",
      },
      {
        name: "reviews",
      },
    ],
    paths: {
      "/api/v1/bootcamps": {
        get: {
          tags: ["bootcamps crud"],
          summary: "get all bootcamps",
          description: "get all bootcamps",
          operationId: "getAllBootcamps",
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
        post: {
          tags: ["bootcamps crud"],
          summary: "create a bootcamp",
          description: "create a bootcamp",
          operationId: "createABootcamp",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_bootcamps_body",
                },
                examples: {
                  "create a bootcamp": {
                    value: {
                      acceptGi: true,
                      address: "220 Pawtucket St, Lowell, MA 01854",
                      careers: [
                        "Web Development",
                        "UI/UX",
                        "Mobile Development",
                      ],
                      description:
                        "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX",
                      email: "enroll@moderntech.com",
                      housing: false,
                      jobAssistance: true,
                      jobGuarantee: false,
                      name: "ModernTech Bootcamp protect check",
                      phone: "(222) 222-2222",
                      website: "https://moderntech.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/bootcamps/68cab04a8bd8795f6faed083": {
        get: {
          tags: ["bootcamps crud"],
          summary: "get single bootcamp",
          description: "get single bootcamp",
          operationId: "getSingleBootcamp",
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/bootcamps/12": {
        delete: {
          tags: ["bootcamps crud"],
          summary: "delete a bootcamp",
          description: "delete a bootcamp",
          operationId: "deleteABootcamp",
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/bootcamps/68cab474bfcb465a09d75675": {
        put: {
          tags: ["bootcamps crud"],
          summary: "udpate a bootcamp",
          description: "udpate a bootcamp",
          operationId: "udpateABootcamp",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/bootcamps_68cab474bfcb465a09d75675_body",
                },
                examples: {
                  "udpate a bootcamp": {
                    value: {
                      name: "Test the updates",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/bootcamps/radius/02118/10": {
        get: {
          tags: ["bootcamps crud"],
          summary: "get bootcamps in radius",
          description: "get bootcamps in radius",
          operationId: "getBootcampsInRadius",
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/photo": {
        put: {
          tags: ["courses crud"],
          summary: "Upload a photo for a bootcamp",
          description: "Upload a photo for a bootcamp",
          operationId: "uploadAPhotoForABootcamp",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  $ref: "#/components/schemas/5d725a1b7b292f5f8ceff788_photo_body",
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/courses": {
        get: {
          tags: ["courses crud"],
          summary: "get all courses",
          description: "get all courses",
          operationId: "getAllCourses",
          parameters: [
            {
              name: "select",
              in: "query",
              required: false,
              schema: {
                type: "string",
                example: "title",
              },
            },
            {
              name: "page",
              in: "query",
              required: false,
              schema: {
                type: "string",
                example: "4",
              },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: {
                type: "string",
                example: "2",
              },
            },
          ],
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/courses": {
        get: {
          tags: ["courses crud"],
          summary: "get bootcamp courses",
          description: "get bootcamp courses",
          operationId: "getBootcampCourses",
          responses: {
            200: {
              description: "",
            },
          },
        },
        post: {
          tags: ["courses crud"],
          summary: "Add a course to a bootcamp",
          description: "Add a course to a bootcamp",
          operationId: "addACourseToABootcamp",
          responses: {
            200: {
              description: "",
            },
          },
        },
      },
      "/api/v1/courses/5d725a4a7b292f5f8ceff789": {
        get: {
          tags: ["courses crud"],
          summary: "get single course",
          description: "get single course",
          operationId: "getSingleCourse",
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/courses/68d14d75d2fc0da1fe950929": {
        delete: {
          tags: ["courses crud"],
          summary: "delete a course",
          description: "delete a course",
          operationId: "deleteACourse",
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/auth/register": {
        post: {
          tags: ["authentication"],
          summary: "Register user",
          description: "Register user",
          operationId: "registerUser",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/auth_register_body",
                },
                examples: {
                  "Register user": {
                    value: {
                      email: "admin@gmail.com",
                      name: "Admin Account",
                      password: "123456",
                      role: "publisher",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["authentication"],
          summary: "login user",
          description: "login user",
          operationId: "loginUser",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/auth_login_body",
                },
                examples: {
                  "login user": {
                    value: {
                      email: "admin@gmail.com",
                      password: "123456",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/auth/me": {
        get: {
          tags: ["authentication"],
          summary: "get logged in user via token",
          description: "get logged in user via token",
          operationId: "getLoggedInUserViaToken",
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/auth/forgotpassword": {
        post: {
          tags: ["authentication"],
          summary: "forgot password",
          description: "forgot password",
          operationId: "forgotPassword",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/auth_forgotpassword_body",
                },
                examples: {
                  "forgot password": {
                    value: {
                      email: "user@gmail.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
      "/api/v1/auth/resetpassword/00ddf76ed7d4cc98057c240102b5c11c25c14735": {
        put: {
          tags: ["authentication"],
          summary: "reset password",
          description: "reset password",
          operationId: "resetPassword",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/resetpassword_00ddf76ed7d4cc98057c240102b5c11c25c14735_body",
                },
                examples: {
                  "reset password": {
                    value: {
                      password: "123456",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/auth/updatedetails": {
        post: {
          tags: ["authentication"],
          summary: "update user details",
          description: "update user details",
          operationId: "updateUserDetails",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/auth_updatedetails_body",
                },
                examples: {
                  "update user details": {
                    value: {
                      email: "user@gmail.com",
                      name: "User updated",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/auth/updatepassword": {
        put: {
          tags: ["authentication"],
          summary: "update the password",
          description: "update the password",
          operationId: "updateThePassword",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/auth_updatepassword_body",
                },
                examples: {
                  "update the password": {
                    value: {
                      currentPassword: "usmanalikhan",
                      newPassword: "123456",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/auth/logout": {
        get: {
          tags: ["authentication"],
          summary: "log the user out / clear cookie",
          description: "log the user out / clear cookie",
          operationId: "logTheUserOutClearCookie",
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/users": {
        get: {
          tags: ["users"],
          summary: "get all users",
          description: "get all users",
          operationId: "getAllUsers",
          responses: {
            200: {
              description: "",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/reviews/5d7a514b5d2c12c7449be027": {
        get: {
          tags: ["reviews"],
          summary: "get single review",
          description: "get single review",
          operationId: "getSingleReview",
          responses: {
            200: {
              description: "",
            },
          },
          security: [{}],
        },
      },
    },
    components: {
      schemas: {
        bootcamps_68cab474bfcb465a09d75675_body: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Test the updates",
            },
          },
        },
        auth_register_body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "admin@gmail.com",
            },
            name: {
              type: "string",
              example: "Admin Account",
            },
            password: {
              type: "string",
              example: "123456",
            },
            role: {
              type: "string",
              example: "publisher",
            },
          },
        },
        auth_forgotpassword_body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "user@gmail.com",
            },
          },
        },
        resetpassword_00ddf76ed7d4cc98057c240102b5c11c25c14735_body: {
          type: "object",
          properties: {
            password: {
              type: "string",
              example: "123456",
            },
          },
        },
        auth_login_body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "admin@gmail.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },
        auth_updatedetails_body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "user@gmail.com",
            },
            name: {
              type: "string",
              example: "User updated",
            },
          },
        },
        auth_updatepassword_body: {
          type: "object",
          properties: {
            currentPassword: {
              type: "string",
              example: "usmanalikhan",
            },
            newPassword: {
              type: "string",
              example: "123456",
            },
          },
        },
        "5d725a1b7b292f5f8ceff788_photo_body": {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary",
            },
          },
        },
        v1_bootcamps_body: {
          type: "object",
          properties: {
            acceptGi: {
              type: "boolean",
              example: true,
            },
            address: {
              type: "string",
              example: "220 Pawtucket St, Lowell, MA 01854",
            },
            careers: {
              type: "array",
              example: ["Web Development", "UI/UX", "Mobile Development"],
              items: {
                type: "string",
                example: "Web Development",
              },
            },
            description: {
              type: "string",
              example:
                "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX",
            },
            email: {
              type: "string",
              example: "enroll@moderntech.com",
            },
            housing: {
              type: "boolean",
              example: false,
            },
            jobAssistance: {
              type: "boolean",
              example: true,
            },
            jobGuarantee: {
              type: "boolean",
              example: false,
            },
            name: {
              type: "string",
              example: "ModernTech Bootcamp protect check",
            },
            phone: {
              type: "string",
              example: "(222) 222-2222",
            },
            website: {
              type: "string",
              example: "https://moderntech.com",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // paths to your API files
};

// const swaggerSpec = swaggerJsdoc(options);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.set("query parser", "extended");

// Swagger
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Body parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // ✅ Add this for query parsing

// Cookie parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileUpload());

// set Static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
  // keyGenerator: (req) => {
  //   // Using only user ID, no IP needed
  //   return req.user?.id || "anonymous";
  // },
  validate: { ip: false, trustProxy: false },
  // Use x-forwarded-for from Vercel
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"] || "unknown";
  },
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// use cors
app.use(cors());

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});

// handle Unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // close server and exit
  server.close(() => {
    process.exit(1);
  });
});
