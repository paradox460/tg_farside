# Farside Telegram Bot

A simple bot that connects to the Farside website, grabs the comics for today, or a given date, and then sends them to a Telegram chnnel.

**Currently runs the [The Far Side](https://t.me/thefarsidecomics) channel.**

Usage is assumed to be through a docker container, and so minimal guidance is offered.

Configuration is through ENVars, the following _must_ be set:

- `TELEGRAM_BOT_TOKEN` - The token for your Telegram bot, obtained from BotFather
- `TELEGRAM_CHAT_ID` - The chat ID where the bot will post the comics to

See the example Quadlet and Timer SystemD config files for how to use it.


>! [Note]
> Please be nice to the farside website, and don't run this more than a few times a day. They don't post comics any more frequently than that.
