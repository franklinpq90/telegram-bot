import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074; 
const GROUP_ID = -1001946468061; 
const WAKE_UP_DELAY = 2000;

const generateRegistrationMessage = (name: string) => {
    return `${name} se ha registrado correctamente en el sistema de alarma.`;
};

const neighborsMapping: { [key: string]: string } = {
    "andreafabiola1997@gmail.com": generateRegistrationMessage("Andrea Rodríguez"),
    "portoviejojc@gmail.com": generateRegistrationMessage("Antonio Chinga"),
    "candraus@gmail.com": generateRegistrationMessage("César Andraus"),
    "cindygiselle6@gmail.com": generateRegistrationMessage("Cindy Díaz"),
    //... [Resto de los vecinos]
    "marcosbenicha@gmail.com": generateRegistrationMessage("Marcos Benitez"),
    "edgargarcia9565@gmail.com": generateRegistrationMessage("Edgar García")
};

bot.command('wake_up', (ctx) => {});

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    const data = req.body;

    if (data && data.user_id) {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            bot.api.sendMessage(USER_ID, "/wake_up");
            bot.api.sendMessage(GROUP_ID, "/wake_up");

            await new Promise(resolve => setTimeout(resolve, WAKE_UP_DELAY));

            bot.api.sendMessage(USER_ID, messageToSend);
            bot.api.sendMessage(GROUP_ID, messageToSend);
        }
    }

    res.status(200).send("OK");
});

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

if (process.env.NODE_ENV !== "production") {
    bot.start();
}