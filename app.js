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

app.event('emoji_changed', async ({ event, client }) => {
  let text;
  if (event.subtype === 'add') {
    text = `-> \`:${event.name}:\`  :${event.name}:\n${event.value}`;
  } else {
    text = `<- \`:${event.names.join(':, :')}:\``;
  }

  try {
    await client.chat.postMessage({
      channel: process.env.CHANNEL_TO_NOTIFY,
      text: text
    });
  } catch (error) {
    console.log(error);

    throw new Error('Failed posting a message.')
  }
});

module.exports.handler = serverlessExpress({
    app: expressReceiver.app
});