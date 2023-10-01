import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";
import fetch from 'node-fetch';

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074;
const IFTTT_URL = `https://maker.ifttt.com/trigger/activate_alarm/with/key/kOlKPd9k75kNySn7c3JSKgnQBDlbXrYd6O6z-O-6CPy`;

const neighborsMapping: { [key: string]: string } = {
    "001": "El vecino Pepito ha activado la alarma",
    "002": "El vecino Ana ha activado la alarma",
    "003": "El vecino Luis ha activado la alarma",
};

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command, (ctx) => ctx.reply(message));
    }
}

registerNeighborCommands();
bot.api.setMyCommands([]);

function pingTelegramAndSendMessage(userId: number, messageToSend: string) {
    bot.api.getMe()
        .then(response => {
            console.log("Ping exitoso:", response);
            return bot.api.sendMessage(userId, messageToSend);
        })
        .then(response => {
            console.log("Mensaje enviado con éxito:", response);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    console.log("Recibida petición desde IFTTT:", req.body);

    const data = req.body;

    if (data && data.user_id && data.action === "button_pressed") {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            pingTelegramAndSendMessage(USER_ID, messageToSend);
            try {
                const response = await fetch(IFTTT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`Respuesta de IFTTT: ${response.status}`);
            } catch (err) {
                console.error("Error al enviar webhook a IFTTT:", err);
            }
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
