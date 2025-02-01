const express = require("express");
const cors = require("cors");
const { Telegraf, Markup } = require("telegraf");
const messages = require("./messages");
const routes = require("./src/routes/routes");
const {
  registerUserBot,
  checkStart,
} = require("./src/controllers/controllers");
require("dotenv").config();

const token = process.env.TOKEN;
const webAppUrl = process.env.WEB_URL;
const MAX_FIO_LENGTH = 50;
const MIN_FIO_LENGTH = 3;

const app = express();
const bot = new Telegraf(token);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// app.get("/api/getUser", async (req, res) => {
//   const { initData } = req.body;

// if (!initData) {
//   return res.status(400).json({ error: "initData is required" });
// }

// const params = new URLSearchParams(initData);
// const chatId = params.get("user.id");

//   try {
//     await bot.telegram.answerWebAppQuery(1, {
//       type: "article",
//       id: 1,
//       title: "Ваше сообщение",
//       input_message_content: {
//         message_text: message,
//       },
//     });
//     res.status(200).json({
//       isAdmin: false,
//       fio: "test",
//       chatId: queryId,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: messages.internalServerError });
//   }
// });

const userState = {};

app.use("/api/mini_app", routes);

bot.command("start", async (ctx) => {
  const chat_id = ctx.chat.id;
  const code = await checkStart(chat_id);

  if (code === 200) {
    await ctx.reply(
      messages.welcomeNew,
      Markup.inlineKeyboard([
        Markup.button.webApp(messages.openWebAppButton, `${webAppUrl}`),
      ]).resize()
    );
    userState[chat_id] = "awaiting_fio";
  } else if (code === 201) {
    await ctx.reply(
      messages.welcomeSecUser,
      Markup.inlineKeyboard([
        Markup.button.webApp(messages.openWebAppButton, `${webAppUrl}`),
      ]).resize()
    );
  } else {
    await ctx.reply(
      messages.internalServerError,
      Markup.inlineKeyboard([
        Markup.button.webApp(messages.openWebAppButton, `${webAppUrl}`),
      ]).resize()
    );
  }
});

bot.on("text", async (ctx) => {
  const chat_id = ctx.chat.id;
  const text = ctx.message.text;

  if (userState[chat_id] === "awaiting_fio") {
    const fio = text;

    if (fio.length > MAX_FIO_LENGTH) {
      await ctx.reply(messages.fioTooLong);
      return;
    }

    if (fio.length < MIN_FIO_LENGTH) {
      await ctx.reply(messages.fioTooShort);
      return;
    }

    if (!/^[а-яА-ЯёЁ]+(?:\s[а-яА-ЯёЁ]+){1,2}$/.test(fio)) {
      await ctx.reply(messages.fioInvalid);
      return;
    }

    console.log(`ФИО пользователя ${chat_id}: ${fio}`);
    //registerUserBot(chat_id, fio)

    await ctx.reply(messages.awaitFIOAdmin);

    delete userState[chat_id];
  } else {
    await ctx.reply(messages.understandMsg);
  }
});

app.listen(PORT, () => {
  console.log(`${messages.backendRunning} ${PORT}`);
});

bot.launch();
