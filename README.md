# Checker

Just a small module to check website in interval of one hour and send problems on discord

## Install

``` bash
npm i @iryu54/checker
```

## Usage

``` bash
DISCORD_TOKEN=<your bot token\> CHANNEL_ID=<channel to send msg> URLS=http://some-site.com,https://another-site/somewhere checker
```

Available command in discord: 

| Command  | Description  | 
|---|---|
| /isAlive  | Check if service is online or not  |
| /autotest  | Launch a full report  |

