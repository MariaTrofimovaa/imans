const express = require("express");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const paramsEN = require("../languages/en.json");
const paramsRU = require("../languages/ru.json");

const router = express.Router();

router.get("/", async (req, res) => {
  const renderedTemplate = await mainRender("en");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(renderedTemplate);
});

router.get("/:lang", async (req, res) => {
  const { lang } = req.params;
  const renderedTemplate = await mainRender(lang);

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(renderedTemplate);
});

async function mainRender(lang) {
  const templatePath = path.join(__dirname, "../templates/base.hbs");
  const templateContent = fs.readFileSync(templatePath, "utf8");

  const partialsDir = path.join(__dirname, "../templates");
  const partialsFiles = fs.readdirSync(partialsDir);

  partialsFiles.forEach((partialFile) => {
    const partialPath = path.join(partialsDir, partialFile);
    const partialContent = fs.readFileSync(partialPath, "utf8");

    const partialName = path.parse(partialFile).name;
    handlebars.registerPartial(partialName, partialContent);
  });

  const template = handlebars.compile(templateContent);

  let params;

  if (lang === "ru") {
    params = paramsRU;
  } else {
    params = paramsEN;
  }

  const renderedTemplate = template(params);
  return renderedTemplate;
}

module.exports = router;
