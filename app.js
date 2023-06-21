const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const api = require("./api");

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static("./public"));

app.use(cors());
app.use(express.json());

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error at server launch:", err);
  }
  console.log(`Server running at port ${PORT}`);
});

app.use("/", api.page);
app.use("/api/v1/client", api.client);

const sassFilePath = path.join(__dirname, "./public/sass/main.scss");
const cssFilePath = path.join(__dirname, "./public/css/main.min.css");

const options = {
  file: sassFilePath,
  outputStyle: "compressed",
};

sass.render(options, (error, result) => {
  if (error) {
    console.error("Ошибка компиляции Sass:", error);
    return;
  }

  fs.writeFile(cssFilePath, result.css.toString(), (error) => {
    if (error) {
      console.error("Ошибка записи CSS-файла:", error);
      return;
    }

    console.log("Sass-файл успешно скомпилирован в CSS.");
  });
});

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Not found",
  });
});

app.use((error, _, res, __) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({
    status: "error",
    code: status,
    message,
  });
});
