import * as restify from 'restify'
import * as builder from 'botbuilder'
import * as botbuilderAzure from 'botbuilder-azure'

//Setup Restify Server
let server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log("%s listening to %s", server.name, server.url)
})

// Create chat connector for communicating with the Bot Framework Service
let connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
})

// Listen for messages from users 
server.post("/api/messages", connector.listen())

const tableName = "botdata"
const azureTableClient = new botbuilderAzure.AzureTableClient(tableName, process.env["AzureWebJobsStorage"])
const tableStorage = new botbuilderAzure.AzureBotStorage({ gzipData: false }, azureTableClient)

// Create your bot with a function to receive messages from the user
let bot = new builder.UniversalBot(connector)
bot.set("storage", tableStorage)

const luisAppId = process.env.LuisAppId;
const luisAPIKey = process.env.LuisAPIKey;
const luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const luisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
let recognizer = new builder.LuisRecognizer(luisModelUrl)
let intents = new builder.IntentDialog({ recognizers: [recognizer] })
    .matches("Greeting", (session) => {
        session.send("Greeting")
    })
    .matches("Deposit", (session) => {
        session.send("You get deposit.")
    })
    .matches("Balance", (session) => {
        session.send("You get balance")
    })
    .onDefault((session) => {
        session.send("Sorry, I didn't understand \"%s\"", session.message.text)
    })

bot.dialog("/", intents)





// let bot = new builder.UniversalBot(connector, [
//     session => {
//         session.send("Welcome to Young's bot.");
//     }
// ])

// bot.dialog("deposit", [
//     (session) => {
//         builder.Prompts.number(session, "金額？", { retryPrompt: "請輸入數字金額" })
//     },
//     (session, results) => {
//         session.dialogData.amount = results.response;
//         session.send("已為您加值 %d", results.response);
//         session.endDialogWithResult({ response: session.dialogData.amount })
//     }
// ]).triggerAction({ matches: /^deposit/i })