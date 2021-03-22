# Counting bot
This is not meant to be a significantly powerful bot, it is merely for experimentation.

Feel free to contribute!

## Configuration

The bot has a single configuration file at the root of the repository, `config.json`.

| Key | Purpose | Default |
|:----|:--------|:--------|
|token*|Your bot token|N/a|
|prefix*|Your bot prefix|N/a|
|countChannelID*|The ID of the channel counting takes place in|N/a|
|adminRolesIDs|Roles that allow the user to run `set-count`. There are no other admin commands (for now)|`[]`|
|errorOnCommandNotFound|Whether to tell the user the command wasn't found if they try to use a command that doesn't exist|`false`|

*necessary to function

## Setup

To install the required dependencies, and have `yarn` installed, run:

```sh
yarn
```

If you use solely NPM, run:

```sh
npm i
```

## Executing

To run the bot, do the following if you use yarn: 

```sh
yarn start
```

Or the following for npm:

```sh
npm run start
```

This builds the typescript code to `dist/` and runs it. There are several scripts in `package.json` to build and run linters.

## Credits

This bot is written entirely in TypeScript by @stars#9093. Report any bugs on here or on Discord.