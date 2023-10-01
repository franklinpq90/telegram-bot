import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const GROUP_ID = 352099074; // ID del grupo

const neighborsMapping: { [key: string]: string } = {
    "001": "El vecino Pepito ha activado la alarma",
    "002": "El vecino Ana ha activado la alarma",
    "003": "El vecino Luis ha activado la alarma",
    // ... añade más si es necesario
};

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command, (ctx) => ctx.reply(message));
    }
}

registerNeighborCommands();
bot.api.setMyCommands([]);

const app = express();
app.use(express.json());

app.post('/ifttt-webhook', (req, res) => {
    const userId = req.body.user_id;

    // Verifica si el userId está en nuestro mapeo de vecinos
    if (neighborsMapping[userId]) {
        bot.telegram.sendMessage(GROUP_ID, neighborsMapping[userId]);
    } else {
        console.log(`Usuario no reconocido: ${userId}`);
    }

    res.sendStatus(200);
});

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
});

if (process.env.NODE_ENV !== "production") {
  bot.start();
}
