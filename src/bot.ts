import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx: Context) => ctx.reply("Welcome! I am your new Telegram bot."));

bot.help((ctx: Context) =>
  ctx.reply("Send me a message and I will echo it back to you.")
);

bot.on("text", async (ctx: Context) => {
  const username = ctx.from?.username || "Unknown";
  const userId = ctx.from?.id;

  if (!userId) {
    console.error("User ID is undefined");
    return;
  }

  try {
    const profilePhotos = await ctx.telegram.getUserProfilePhotos(userId, 0, 1);
    const photoUrl =
      profilePhotos.total_count > 0
        ? await ctx.telegram.getFileLink(profilePhotos.photos[0][0].file_id)
        : "No profile picture";

    console.log(`Username: ${username}`);
    console.log(`Profile picture URL: ${photoUrl}`);

    await ctx.reply(`OK`);
  } catch (error) {
    console.error("Error fetching user data:", error);
    await ctx.reply(`KO`);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
