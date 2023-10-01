import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import express from "express";
import fetch from 'node-fetch';

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074; // ID del usuario privado
const GROUP_ID = -1001946468061; // ID del grupo
const IFTTT_ACTIVATE_URL = `https://maker.ifttt.com/trigger/activate_alarm/with/key/kOlKPd9k75kNySn7c3JSKgnQBDlbXrYd6O6z-O-6CPy`;
const IFTTT_DEACTIVATE_URL = `https://maker.ifttt.com/trigger/deactivate_alarm/with/key/909qHZ89JlAPXhoRezAYf`;
const WAKE_UP_DELAY = 2000;

const neighborsMapping: { [key: string]: string } = {
    "002": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nEl vecino Pepito podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
    // ... [Resto de mapeos de vecinos]
};

const inlineKeyboard = new InlineKeyboard().text('Desactivar alarma', 'DEACTIVATE_ALARM');

bot.command('stop_alarm', async (ctx) => {
    // ... [Código existente para stop_alarm]
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
    // ... [Resto del código del webhook]
});

app.use(webhookCallback(bot, "express"));

bot.on('callback_query', async (ctx) => {
    if (ctx.callbackQuery.data === 'DEACTIVATE_ALARM') {
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
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
});

if (process.env.NODE_ENV !== "production") {
    bot.start();
}