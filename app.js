"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const builder = require("botbuilder");
// import * as botbuilderAzure from 'botbuilder-azure'
//Setup Restify Server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log("%s listening to %s", server.name, server.url);
});
// Create chat connector for communicating with the Bot Framework Service
let connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});
// Listen for messages from users 
server.post("/api/messages", connector.listen());
// let bot = new builder.UniversalBot(connector, session => {
//     session.send("You said: %s....", session.message.text)
// })
// let tableName = "botdata"
// let azureTableClient = new botbuilderAzure.AzureTableClient(tableName, process.env["AzureWebJobsStorage"])
// let tableStorage = new botbuilderAzure.AzureBotStorage({ gzipData: false }, azureTableClient)
let bot = new builder.UniversalBot(connector, [
        session => {
        session.send("Welcome to Young's bot.");
    }
]);
bot.dialog("deposit", [
    (session) => {
        builder.Prompts.number(session, "金額？", { retryPrompt: "請輸入數字金額" });
    },
    (session, results) => {
        session.dialogData.amount = results.response;
        session.send("已為您加值 %d", results.response);
        session.endDialogWithResult({ response: session.dialogData.amount });
    }
]).triggerAction({ matches: /^deposit/i });
//# sourceMappingURL=app.js.map