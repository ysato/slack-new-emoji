const { App, ExpressReceiver } = require('@slack/bolt');
const serverlessExpress = require('@vendia/serverless-express')

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver
});

app.event('channel_created', async ({ event, client }) => {
  try {
    await client.chat.postMessage({
      channel: process.env.CHANNEL_TO_NOTIFY,
      text: `<#${event.channel.id}>`
    });
  } catch (error) {
    console.log(error);

    throw new Error('Failed posting a message.')
  }
});

module.exports.handler = serverlessExpress({
    app: expressReceiver.app
});