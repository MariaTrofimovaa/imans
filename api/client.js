const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const formData = req.body;

  try {
    const sendMessageResponse = await sendTelegramMessage(formData);
    const accessToken = await getAccessToken();
    const sendEmailResponse = await sendInternalEmail(accessToken, formData);
    const sendEmailToClientResponse = await sendExternalEmail(
      accessToken,
      formData
    );
    // const saveDataResponse = await saveDataToCSV(formData);

    res.json({
      status: "Success",
      code: 200,
      data: {
        sendMessageResponse: sendMessageResponse.data,
        accessToken: accessToken,
        sendEmailResponse: sendEmailResponse,
        sendEmailToClientResponse: sendEmailToClientResponse,
        // saveDataResponse: saveDataResponse,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const propertyNames = {
  source: "Source",
  name: "Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
};

async function sendTelegramMessage(formData) {
  const botToken = process.env.BOT_TOKEN;
  const groupId = process.env.GROUP_ID;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  let message = "";

  for (let prop in formData) {
    if (formData.hasOwnProperty(prop)) {
      let label = propertyNames[prop] || prop;
      message =
        message + "<strong>" + label + "</strong>: " + formData[prop] + "\n";
    }
  }

  const payload = {
    chat_id: groupId,
    text: message,
    parse_mode: "HTML",
  };

  return axios.post(url, payload);
}

async function saveDataToCSV(formData) {
  const date = new Date().toISOString();
  const csvData =
    date +
    ";" +
    Object.keys(formData)
      .map((field) => `${formData[field]}`)
      .join(";");

  const fileName = "imans_data.csv";

  fs.readFile(fileName, "utf8", (error, existingData) => {
    if (error) {
      console.error("Ошибка при чтении данных формы:", error);
    }

    const updatedData = existingData + "\n" + csvData;

    // TO FIX. affects page reload :
    fs.writeFile(fileName, updatedData, "utf8", (error) => {
      if (error) {
        console.error("Ошибка при сохранении данных формы:", error);
      } else {
        console.log(`Данные формы добавлены в файл ${fileName}`);
      }
    });
  });
}

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const accessTokenUrl = process.env.ACCESS_TOKEN_URL;
const grantType = process.env.GRANT_TYPE;
const scope = process.env.SCOPE;

async function getAccessToken() {
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
    scope: scope,
  };

  try {
    const response = await axios.post(accessTokenUrl, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to retrieve access token:", error.message);
    throw error;
  }
}

async function sendInternalEmail(accessToken, formData) {
  const apiUrl = process.env.GRAPH_API_URL;
  const email = process.env.INTERNAL_EMAIL;
  let message = "";

  for (let prop in formData) {
    if (formData.hasOwnProperty(prop)) {
      let label = propertyNames[prop] || prop;
      message += "<strong>" + label + "</strong>: " + formData[prop] + "<br/>";
    }
  }

  const emailData = {
    message: {
      subject: "New request",
      body: {
        contentType: "HTML",
        content: message,
      },
      toRecipients: [
        {
          emailAddress: {
            address: email,
          },
        },
      ],
    },
    saveToSentItems: true,
  };

  try {
    const response = await axios.post(apiUrl, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
}

async function sendExternalEmail(accessToken, formData) {
  const apiUrl = process.env.GRAPH_API_URL;

  const email = formData.email;
  const indexHtmlPath = path.join(__dirname, "..", "message.html");

  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

  const emailData = {
    message: {
      subject: "Thank you for your request",
      body: {
        contentType: "HTML",
        content: indexHtml,
      },
      toRecipients: [
        {
          emailAddress: {
            address: email,
          },
        },
      ],
    },
    saveToSentItems: true,
  };

  try {
    const response = await axios.post(apiUrl, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
}

module.exports = router;
