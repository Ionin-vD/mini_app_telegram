const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const messages = require("./messages");
require("dotenv").config();

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const cors = require("cors");
const https = require("https");
const fs = require("fs");
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const token = process.env.TOKEN;
const webAppUrl = process.env.WEB_URL;

const app = express();
const bot = new Telegraf(token);
const PORT = process.env.PORT || 3001;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/pxmx-home.ddns.net/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/pxmx-home.ddns.net/fullchain.pem"
  ),
};
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.use(cors());
app.use(express.json());

bot.command("start", async (ctx) => {
  const chat_id = ctx.chat.id;
  console.log(chat_id);

  await ctx.reply(
    messages.welcome,
    Markup.inlineKeyboard([
      Markup.button.webApp(messages.openWebAppButton, `${webAppUrl}`),
    ]).resize()
  );
});

app.get("/api/getUser", async (req, res) => {
  try {
    console.log("попытка запроса");
    res.json({
      isAdmin: false,
      fio: "Иван",
      chatId: 1,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: messages.internalServerError });
  }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

bot.launch();
