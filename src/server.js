import pkg from '@slack/bolt';
const { App, ExpressReceiver } = pkg;
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { tonePrompts } from './tonePrompts.js';

dotenv.config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
  userToken: process.env.SLACK_USER_TOKEN // Add user token for posting as user
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Parse the command to extract tone and message
function parseCommand(text) {
  const match = text.match(/^(\w+):\s*(.+)$/);
  if (!match) return null;
  
  const [, tone, message] = match;
  return { tone, message };
}

// Generate AI response with the specified tone
async function generateTonedResponse(message, tone) {
  const prompt = tonePrompts[tone];
  if (!prompt) {
    return null;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  return completion.choices[0].message.content.trim();
}

// Handle the /ai-fy command
app.command('/ai-fy', async ({ command, ack, respond }) => {
  await ack();

  const parsed = parseCommand(command.text);
  if (!parsed) {
    await respond({
      text: "Invalid format. Please use: /ai-fy <tone>: <message>",
      response_type: 'ephemeral'
    });
    return;
  }

  const { tone, message } = parsed;

  if (!tonePrompts[tone]) {
    await respond({
      text: `Invalid tone. Supported tones: ${Object.keys(tonePrompts).join(', ')}`,
      response_type: 'ephemeral'
    });
    return;
  }

  try {
    const tonedMessage = await generateTonedResponse(message, tone);
    
    await respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: tonedMessage
          }
        }
      ],
      response_type: 'ephemeral'
    });
  } catch (error) {
    console.error('Error generating response:', error);
    await respond({
      text: "Sorry, there was an error processing your request.",
      response_type: 'ephemeral'
    });
  }
});




// Add a simple health check endpoint
receiver.router.get('/health', (req, res) => {
  res.send('OK');
});

const port = process.env.PORT || 3000;
await app.start(port);
console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
console.log(`🔗 Slash Command URL: http://your-domain:${port}/slack/events`);
console.log(`🔗 Interactivity URL: http://your-domain:${port}/slack/events`);
