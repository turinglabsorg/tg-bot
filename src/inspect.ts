import { inspectUser } from "./utils/telegramApi";

async function main() {
  const userId = process.argv[2];
  if (!userId) {
    console.error("Please provide a user ID as an argument");
    process.exit(1);
  }

  const userInfo = await inspectUser(parseInt(userId, 10));
  console.log(userInfo);
}

main().catch(console.error);
