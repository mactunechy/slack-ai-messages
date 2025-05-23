# AI-fy Slack Bot

A Slack bot that uses AI to transform messages into specific tones while preserving their core meaning.

## Features

- Transform messages into different tones:
  - Professional: Formal and business-appropriate
  - Cool: Casual and friendly
  - Encouraging: Supportive and uplifting
  - Direct: Straight to the point
  - Empathetic: Warm and emotionally considerate
- Interactive confirmation before sending messages
- Ephemeral previews of transformed messages

## Setup

1. Create a Slack App at https://api.slack.com/apps
   - Add the following Bot Token Scopes:
     - `chat:write`
     - `commands`
     - `chat:write.customize`
   - Create a slash command `/ai-fy`
     - Request URL: `https://your-domain/slack/events`
   - Enable Interactivity
     - Request URL: `https://your-domain/slack/events`

2. Create an OpenAI API key at https://platform.openai.com/api-keys

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Then fill in the following in your `.env` file:
   - `SLACK_BOT_TOKEN`: Your Slack bot's OAuth token (starts with `xoxb-`)
   - `SLACK_SIGNING_SECRET`: Your Slack app's signing secret
   - `SLACK_APP_TOKEN`: Your Slack app-level token (starts with `xapp-`)
   - `OPENAI_API_KEY`: Your OpenAI API key

4. Install dependencies:
   ```bash
   pnpm install
   ```

5. Start the server:
   - Development: `pnpm dev`
   - Production: `pnpm start`

## Usage

1. In any Slack channel where the bot is installed, use the command:
   ```
   /ai-fy <tone>: <message>
   ```
   For example:
   ```
   /ai-fy professional: we need to fix this asap its breaking everything
   ```

2. The bot will show you the transformed message with "Send" and "Cancel" options

3. Click "Send" to post the message to the channel, or "Cancel" to discard it

## Development

- The bot is built using the Slack Bolt framework
- Message transformation is powered by OpenAI's GPT-4
- Node.js with ES modules is used for the runtime environment
