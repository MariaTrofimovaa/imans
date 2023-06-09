const express = require("express");
const cors = require("cors");

const api = require("./api");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error at server launch:", err);
  }
  console.log(`Server running at port ${PORT}`);
});

app.use("/api/v1/client", api.client);

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Not found",
  });
});

// app.use((error, _, res, __) => {
//   const { status = 500, message = "Server error" } = error;
//   res.status(status).json({
//     status: "error",
//     code: status,
//     message,
//   });
// });

app.use((err, _, res, __) => {
  res.status(err.status || 500).send({ error: err.message });
});