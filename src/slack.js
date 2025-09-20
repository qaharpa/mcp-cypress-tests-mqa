import { WebClient } from "@slack/web-api";
import settings from "../config/settings.json" assert { type: "json" };

// Initialize Slack client
const slackClient = new WebClient(settings.slack.token);

export async function sendSlackNotification(message) {
  try {
    await slackClient.chat.postMessage({
      channel: settings.slack.channel,
      text: message,
    });
    console.log("📢 Sent Slack notification.");
  } catch (err) {
    console.error("❌ Failed to send Slack message:", err);
  }
}
