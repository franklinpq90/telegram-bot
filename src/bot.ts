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

const neighborsMapping = {
    "001": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nEl vecino Pepito podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
    "002": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nLa vecina Ana podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
    "003": "🚨🚨🚨 ¡ALERTA DE EMERGENCIA! 🚨🚨🚨\nEl vecino Luis podría estar en peligro. 🆘❗️\nPor favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\nSi todo está en orden, puedes desactivar la alarma.",
};

bot.command('wake_up', (ctx) => { /* simplemente despertar, no hacer nada */ });

bot.command('stop_alarm', async (ctx) => {
    // ... (mismo código que antes)
});

const inlineKeyboard = new InlineKeyboard().row({ text: 'Desactivar alarma', callback_data: 'DEACTIVATE_ALARM' });

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command, (ctx) => ctx.reply(message, { reply_markup: inlineKeyboard }));
    }
};

registerNeighborCommands();

bot.on('callback_query', async (ctx) => {
    if (ctx.callbackQuery.data === 'DEACTIVATE_ALARM') {
        // (lógica para desactivar la alarma, igual que antes)
    }
});

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    // (mismo código que antes)
});

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot escuchando en el puerto ${PORT}`);
});

if (process.env.NODE_ENV !== "production") {
    bot.start();
}