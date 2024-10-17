import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx: Context) => ctx.reply("Welcome! I am your new Telegram bot."));

bot.help((ctx: Context) =>
  ctx.reply("Send me a message and I will echo it back to you.")
);

async function getUserInfo(ctx: Context, userId: number) {
  try {
    const user = await ctx.telegram.getChat(userId);
    const profilePhotos = await ctx.telegram.getUserProfilePhotos(userId, 0, 1);
    const photoUrl =
      profilePhotos.total_count > 0
        ? await ctx.telegram.getFileLink(profilePhotos.photos[0][0].file_id)
        : "No profile picture";

    let infoMessage = `User Info for ID ${userId}:\n`;
    infoMessage += `Username: ${user.username || "Not set"}\n`;
    infoMessage += `First Name: ${user.first_name || "Not set"}\n`;
    infoMessage += `Last Name: ${user.last_name || "Not set"}\n`;
    infoMessage += `Profile Picture: ${photoUrl}`;

    return infoMessage;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return `Error fetching data for user ID ${userId}`;
  }
}

bot.command("inspect", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length !== 2) {
    return ctx.reply("Please provide a user ID. Usage: /inspect <user_id>");
  }

  const userId = parseInt(args[1]);
  if (isNaN(userId)) {
    return ctx.reply("Invalid user ID. Please provide a valid number.");
  }

  const userInfo = await getUserInfo(ctx, userId);
  await ctx.reply(userInfo);
});

bot.on("text", async (ctx: Context) => {
  const username = ctx.from?.username || "Unknown";
  const userId = ctx.from?.id;
  console.log("User ID:", userId);
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
