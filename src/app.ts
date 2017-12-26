import * as restify from 'restify'
import * as builder from 'botbuilder'


//Setup Restify Server
let server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log("%s listening to %s", server.name, server.url)
})

let connector = new builder.ChatConnector()
server.post("/api/messages", connector.listen())

let bot = new builder.UniversalBot(connector, session => {
    session.send("You said: %s....", session.message.text)
})