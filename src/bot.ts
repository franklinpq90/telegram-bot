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

const generateAlertMessage = (name: string) => {
    return `*🚨🚨🚨 ¡ALARMA! 🚨🚨🚨*\n\n 🆘 *${name} podría estar en peligro.* 🆘\n\n⚠️ Por favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\n\n Si todo está en orden, puedes desactivar la alarma pulsando en el botón de abajo.👇`;
};

const neighborsMapping: { [key: string]: string } = {
    "001": generateAlertMessage("El vecino Pepito"),
    "002": generateAlertMessage("La vecina Ana"),
    "003": generateAlertMessage("El vecino Luis")
};

bot.command('wake_up', (ctx) => {});

const inlineKeyboard = new InlineKeyboard().text('Desactivar alarma', 'DEACTIVATE_ALARM');

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command, (ctx) => ctx.reply(message, { reply_markup: inlineKeyboard, parse_mode: 'Markdown' }));
    }
};

registerNeighborCommands();

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    const data = req.body;

    if (data && data.user_id && data.action === "button_pressed") {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            bot.api.sendMessage(USER_ID, "/wake_up");
            bot.api.sendMessage(GROUP_ID, "/wake_up");

            await new Promise(resolve => setTimeout(resolve, WAKE_UP_DELAY));

            bot.api.sendMessage(USER_ID, messageToSend, { reply_markup: inlineKeyboard, parse_mode: 'Markdown' });
            bot.api.sendMessage(GROUP_ID, messageToSend, { reply_markup: inlineKeyboard, parse_mode: 'Markdown' });

            await fetch(IFTTT_ACTIVATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    res.status(200).send("OK");
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
            ctx.reply("Error al intentar desactivar la alarma. Por favor, inténtalo de nuevo.");
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

if (process.env.NODE_ENV !== "production") {
    bot.start();
}
