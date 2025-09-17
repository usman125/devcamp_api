const http = require("http");
const express = require("express");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT;

const app = express();

app.route("/bootcamps", () => {});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});

// const todos = [
//   {
//     id: 1,
//     text: "Todo 1",
//   },
//   {
//     id: 2,
//     text: "Todo 2",
//   },
//   {
//     id: 3,
//     text: "Todo 3",
//   },
// ];

// const server = http.createServer((req, res) => {
//   const { method, url } = req;
//   let body = [];

//   req
//     .on("data", (chunk) => {
//       body.push(chunk);
//     })
//     .on("end", () => {
//       body = Buffer.concat(body).toString();
//       let status = 404;
//       const response = {
//         success: false,
//         data: null,
//       };
//       res.writeHead(status, {
//         "Content-Type": "application/json",
//         "X-Powered-By": "Node.js",
//       });
//       res.end(JSON.stringify(response));
//     });
// });

// const PORT = 5000;

// server.listen(PORT, () => {
//   console.log("Server is running on port", PORT);
// });
