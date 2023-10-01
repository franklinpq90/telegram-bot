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

app.post("/ifttt-webhook", (req, res) => {
    const data = req.body;

    if (data && data.user_id && data.action === "button_pressed") {
      const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            // Usando callApi en lugar del método telegram anterior
            bot.api.callApi('sendMessage', {
                chat_id: GROUP_ID,
                text: messageToSend
            }).catch(error => {
                console.error("Error al enviar el mensaje:", error);
            });
        }
    }

    res.status(200).send("OK");
});


app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
});

if (process.env.NODE_ENV !== "production") {
  bot.start();
}
