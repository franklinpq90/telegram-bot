import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";
import fetch from 'node-fetch';  // Importamos el módulo node-fetch

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074; // ID del usuario
const IFTTT_URL = `https://maker.ifttt.com/trigger/activate_alarm/with/key/kOlKPd9k75kNySn7c3JSKgnQBDlbXrYd6O6z-O-6CPy`; // URL para activar la alarma en IFTTT

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

app.post("/ifttt-webhook", async (req, res) => {
    console.log("Recibida petición desde IFTTT:", req.body);

    const data = req.body;

    if (data && data.user_id && data.action === "button_pressed") {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            bot.api.sendMessage(USER_ID, messageToSend)
                .catch(error => {
                    console.error("Error al enviar el mensaje:", error);
                });

            // Enviar webhook a IFTTT para activar la alarma
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

// Asegurándonos de que el bot use el webhookCallback para Express
app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
});

// Verificando el entorno para saber si debe o no iniciar en modo Long Polling
if (process.env.NODE_ENV !== "production") {
    bot.start();
}
