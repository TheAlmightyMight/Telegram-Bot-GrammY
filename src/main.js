import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import * as dotenv from "dotenv";
import db from "./db.js";

db.connect();
dotenv.config();
const bot = new Bot(process.env.TOKEN);

// Command handlers
// import helpHandler from "./commands/help.js";
// import startHandler from "./commands/start.js";

// Middleware

// Keyboards
// import menuKeyboard from "./keyboards/regular/menu.js";

//Conversations
import greeting from "./conversations/greeting.js";

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(greeting));

// Commands
bot.command("start", async ctx => {
  ctx.reply("write enter");
});

bot.command("enter", async ctx => {
  await ctx.reply("Entering conversation!");
  await ctx.conversation.enter("greeting");
});

bot.on("message:text", ctx => {
  console.log(ctx.message, ctx.chat);
  ctx.reply("Yes.");
});

await bot.start();
