import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import express from "express";
import fetch from 'node-fetch';

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074;
const GROUP_ID = -1001946468061;
const IFTTT_ACTIVATE_URL = `https://maker.ifttt.com/trigger/activate_alarm/with/key/kOlKPd9k75kNySn7c3JSKgnQBDlbXrYd6O6z-O-6CPy`;
const IFTTT_DEACTIVATE_URL = `https://maker.ifttt.com/trigger/deactivate_alarm/with/key/909qHZ89JlAPXhoRezAYf`;
const WAKE_UP_DELAY = 2000;

const neighborsMapping: { [key: string]: string } = {
    "001": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nEl vecino Pepito podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
    "002": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nLa vecina Ana podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
    "003": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nEl vecino Luis podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
};

bot.command('wake_up', (ctx) => { /* simplemente despertar, no hacer nada */ });

bot.command('stop_alarm', async (ctx) => {
    try {
        const response = await fetch(IFTTT_DEACTIVATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            ctx.reply("¡Alarma desactivada! 🔕");
        } else {
            ctx.reply("Hubo un problema al intentar desactivar la alarma. Por favor, inténtalo de nuevo.");
        }
    } catch (err) {
        console.error("Error al enviar webhook a IFTTT para desactivar:", err);
        ctx.reply("Error al intentar desactivar la alarma. Por favor, inténtalo de nuevo.");
    }
});

const inlineKeyboard = new InlineKeyboard().row({ text: 'Desactivar alarma', callback_data: 'DEACTIVATE_ALARM' });

bot.on('callback_query', async (ctx) => {
    if (ctx.callbackQuery.data === 'DEACTIVATE_ALARM') {
        // Aquí se puede colocar el código para desactivar la alarma
        // o llamar a una función que lo haga.
        ctx.answerCallbackQuery({ text: "Alarma desactivada" });
    }
});

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command, (ctx) => ctx.reply(message, { reply_markup: inlineKeyboard }));
    }
};

registerNeighborCommands();

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    console.log("Recibida petición desde IFTTT:", req.body);
    const data = req.body;

    if (data && data.user_id && data.action === "button_pressed") {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            bot.api.sendMessage(USER_ID, "/wake_up").catch(error => {
                console.error("Error al despertar el bot:", error);
            });
            
            await new Promise(resolve => setTimeout(resolve, WAKE_UP_DELAY));

            bot.api.sendMessage(USER_ID, messageToSend, { reply_markup: inlineKeyboard }).catch(error => {
                console.error("Error al enviar el mensaje a usuario privado:", error);
            });
            bot.api.sendMessage(GROUP_ID, messageToSend, { reply_markup: inlineKeyboard }).catch(error => {
                console.error("Error al enviar el mensaje al grupo:", error);
            });

            try {
                const response = await fetch(IFTTT_ACTIVATE_URL, {
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