import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";
import fetch from 'node-fetch';

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074;
const IFTTT_URL = `https://maker.ifttt.com/trigger/activate_alarm/with/key/kOlKPd9k75kNySn7c3JSKgnQBDlbXrYd6O6z-O-6CPy`;

const WAKE_UP_DELAY = 2000; // 2 segundos

const neighborsMapping: { [key: string]: string } = {
    "001": "El vecino Pepito ha activado la alarma",
    "002": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nEl vecino Ana podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️"
    "003": "El vecino Lolo ha activado la alarma",
    "004": "El vecino Luis ha activado la alarma",
};

bot.command('wake_up', (ctx) => { /* simplemente despertar, no hacer nada */ });

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command, (ctx) => ctx.reply(message));
    }
}

registerNeighborCommands();
bot.api.setMyCommands([]);

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    console.log("Recibida petición desde IFTTT:", req.body);

    const data = req.body;

    if (data && data.user_id && data.action === "button_pressed") {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            // Enviar el comando "wake_up" para activar al bot
            bot.api.sendMessage(USER_ID, "/wake_up").catch(error => {
                console.error("Error al despertar el bot:", error);
            });

            // Esperar el delay definido
            await new Promise(resolve => setTimeout(resolve, WAKE_UP_DELAY));

            // Ahora enviar el mensaje real
            bot.api.sendMessage(USER_ID, messageToSend)
                .catch(error => {
                    console.error("Error al enviar el mensaje:", error);
                });

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
