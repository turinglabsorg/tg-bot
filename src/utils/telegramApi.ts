import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function getChat(userId: number): Promise<any> {
  const response = await axios.post(`${API_BASE_URL}/getChat`, {
    chat_id: userId,
  });
  return response.data;
}

async function getUserProfilePhotos(userId: number): Promise<any> {
  const response = await axios.post(`${API_BASE_URL}/getUserProfilePhotos`, {
    user_id: userId,
    limit: 1,
  });
  return response.data;
}

async function getFile(fileId: string): Promise<any> {
  const response = await axios.post(`${API_BASE_URL}/getFile`, {
    file_id: fileId,
  });
  return response.data;
}

export async function inspectUser(userId: number): Promise<string> {
  try {
    const chatData = await getChat(userId);
    const profilePhotos = await getUserProfilePhotos(userId);

    if (chatData.ok && profilePhotos.ok) {
      const user = chatData.result;
      let photoUrl = "No profile picture";

      if (profilePhotos.result.total_count > 0) {
        const fileId = profilePhotos.result.photos[0][0].file_id;
        const fileData = await getFile(fileId);
        if (fileData.ok) {
          photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileData.result.file_path}`;
        }
      }

      let infoMessage = `User Info for ID ${userId}:\n`;
      infoMessage += `Username: ${user.username || "Not set"}\n`;
      infoMessage += `First Name: ${user.first_name || "Not set"}\n`;
      infoMessage += `Last Name: ${user.last_name || "Not set"}\n`;
      infoMessage += `Profile Picture: ${photoUrl}`;

      return infoMessage;
    } else {
      return `Error fetching data for user ID ${userId}`;
    }
  } catch (error) {
    console.error("Error inspecting user:", error);
    return `Error inspecting user ID ${userId}`;
  }
}
