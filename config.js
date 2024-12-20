const express = require('express');
const fs = require('fs');
const { patch } = require('golden-fleece');
const JSON5 = require("json5");

const defaultConfig = `{

    //Put your minecraft IGN here. To use multiple, follow this format: ["account1", "account2"],
    "igns": [""],

    //Used in backend. Get it from the /get_discord_id command in TPM server
    "discordID": "",

    //Refer to https://discord.com/channels/1261825756615540836/1265035635845234792 for help
    "webhook": "",

    //{0} is item. {1} is profit. {2} is price. {3} is target. {4} is buyspeed. {5} is BED or NUGGET. {6} is finder. {7} is the auctionID
    "webhookFormat": "You bought [\`\`{0}\`\`](https://sky.coflnet.com/auction/{7}) for \`\`{2}\`\` (\`\`{1}\`\` profit) in \`\`{4}ms\`\`",
    
    //Flip on a friend's island
    "visitFriend": "",

    //Required to use relist!! Will flip in if you don't have a cookie
    "useCookie": true,

    //Automatically list auctions
    "relist": true,

    //Delay between actions. For example, opening flips
    "delay": 250,

    //Delay for beds. Refer to https://discord.com/channels/1261825756615540836/1275546557508223048 for help
    "waittime": 15,

    //Set up different list price ranges and their corresponding percent off of target price. (The lower value of the range is inclusive, the higher value is exclusive)
    "percentOfTarget": ["0", "10b", 97],

    //Delay between clicks for bed spam (ideally use 100-125)
    "clickDelay": 125,

    //Decides the way to  
    "bedSpam": false,

    //Amount of time (hours) to list an auction.
    "listHours": 48,

    //Won't show spam messages
    "blockUselessMessages": true,

    //Skip the confirm screen on NUGGET flips (50ms faster but higher ban rate)
    //This is an OR statement btw
    "skip": {

        //skip on every flip
        "always": false,

        //Skip on flips with a profit over x
        "minProfit": "25m",

        //Skip on user finder flips
        "userFinder": true,

        // Skip on cosmetic flips
        "skins": true

    },

    //Items that you don't want automatically listed
    "doNotRelist": {

        //Items over x profit
        "profitOver": "50m",

        //cosmetic items
        "skinned": true,

        //Don't list certain item tags
        "tags": ["HYPERION"],

        //Finders to not list. Options: USER, CraftCost, TFM, AI, SNIPER, STONKS, FLIPPER
        "finders": ["USER"]

    },
    
    //Cofl account password. DO NOT SHARE
    "session": ""

}`;

const parsedDefaultConfig = JSON5.parse(defaultConfig);

if (!fs.existsSync('./config.json5')) {
    fs.writeFileSync('./config.json5', defaultConfig);
}

let config = { ...parsedDefaultConfig, ...JSON5.parse(fs.readFileSync('./config.json5', 'utf8')) };

config.doNotRelist = { ...parsedDefaultConfig.doNotRelist, ...config.doNotRelist }
config.skip = { ...parsedDefaultConfig.skip, ...config.skip };

function updateConfig(data) {//golden-fleece my savior idk how to spell that
    const newConfig = patch(defaultConfig, data);
    fs.writeFileSync('./config.json5', newConfig, 'utf-8');
    fs.close
} 

function updateSetting(key, value) {
    // Check if key is a valid path; handle nested objects if needed
    let [firstKey, ...restKeys] = key.split('.');
    let targetObject = config[firstKey];

    // Traverse nested keys if provided
    for (const k of restKeys.slice(0, -1)) {
        targetObject = targetObject[k] ?? {};
    }

    // Update the final key
    const finalKey = restKeys[restKeys.length - 1];
    targetObject[finalKey] = value;

    // Save the update
    updateConfig(JSON5.stringify(config, null, 2), targetObject);
}

const app = express();
app.use(express.json()); // For parsing JSON request bodies


updateConfig(config);

module.exports = { config, updateConfig, updateSetting};