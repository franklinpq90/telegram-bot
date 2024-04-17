import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import express from "express";
import fetch from 'node-fetch';

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074; 
const GROUP_ID = -1001944748227; 
const IFTTT_ACTIVATE_URL = `https://maker.ifttt.com/trigger/activate_alarm/with/key/909qHZ89JlAPXhoRezAYf`;
const IFTTT_DEACTIVATE_URL = `https://maker.ifttt.com/trigger/deactivate_alarm/with/key/909qHZ89JlAPXhoRezAYf`;
const WAKE_UP_DELAY = 2000;

const generateAlertMessage = (name: string) => {
    return `*🚨🚨🚨 ¡ALARMA! 🚨🚨🚨*\n\n 🆘 *${name} podría estar en peligro.* 🆘\n\n⚠️ Por favor, verifica si todo está bien. ¡Actúa con precaución! ⚠️\n\n Si todo está en orden, puedes desactivar la alarma pulsando en el botón de abajo.👇`;
};

const neighborsMapping: { [key: string]: string } = {
    "andreafabiola1997@gmail.com": generateAlertMessage("Andrea Rodríguez"),
    "andreavera1010@icloud.com": generateAlertMessage("Andrea Vera, hija de Juan"),
    "portoviejojc@gmail.com": generateAlertMessage("Antonio Chinga"),
    "candraus@gmail.com": generateAlertMessage("César Andraus"),
    "cindygiselle6@gmail.com": generateAlertMessage("Cindy Díaz"),
    "dannyserrano0708@gmail.com": generateAlertMessage("Danny Serrano"),
    "davidordonez46@gmail.com": generateAlertMessage("David Ordóñez"),
    "dayiarteaga94@hotmail.com": generateAlertMessage("Dayanna Arteaga"),
    "equindemil@gmail.com": generateAlertMessage("Eneida Quindemil"),
    "exiochaparro@gmail.com": generateAlertMessage("Exio Chaparro"),
    "frumbaut@gmail.com": generateAlertMessage("Felipe Rumbaut"),
    "franklin.pq90@gmail.com": generateAlertMessage("Franklin Padrón"),
    "gabita307@hotmail.com": generateAlertMessage("Gaby Miranda"),
    "ginamera307@gmail.com": generateAlertMessage("Gina Mera"),
    "irinuskauz@gmail.com": generateAlertMessage("Irinuska Ureta"),
    "janicerumbaut4@gmail.com": generateAlertMessage("Janice Rumbaut"),
    "josmirbega@gmail.com": generateAlertMessage("Josmir Benítez"),
    "yiyoverapigsa@gmail.com": generateAlertMessage("Juan Vera"),
    "pablitogod123@gmail.com": generateAlertMessage("Juan Pablo Mogro Miranda"),
    "otromen1999@gmail.com": generateAlertMessage("Leonardo Benítez"),
    "leslievelez39@gmail.com": generateAlertMessage("Leslie Velez"),
    "cedenolorenat66@gmail.com": generateAlertMessage("Lorena Cedeño"),
    "luisanajc1965@gmail.com": generateAlertMessage("Luisana Hurtado"),
    "ma.eugeniazevallos@hotmail.com": generateAlertMessage("María Eugenia Zevallos"),
    "gemabravo48@gmail.com": generateAlertMessage("Mariana Cedeño"),
    "pmarinaez@hotmail.com": generateAlertMessage("Marina Espinel"),
    "mauricio94-29@hotmail.com": generateAlertMessage("Mauricio Macias"),
    "vazquezmichel616@gmail.com": generateAlertMessage("Michel Vázquez"),
    "futbol1986@hotmail.com": generateAlertMessage("Orlando Alava"),
    "patriciomiranda58@gmail.com": generateAlertMessage("Patricio Miranda"),
    "delnorteporton@gmail.com": generateAlertMessage("Pedro Rodríguez"),
    "rramosh89@gmail.com": generateAlertMessage("Rafael Ramos"),
    "ramonvelez123456@gmail.com": generateAlertMessage("Ramón Velez"),
    "mirandashailyn@gmail.com": generateAlertMessage("Shailyn Miranda"),
    "silvipatty875@hotmail.com": generateAlertMessage("Silvia Saltos"),
    "xscarrera@hotmail.com": generateAlertMessage("Ximena Carrera"),
    "biomedick.ec@gmail.com": generateAlertMessage("Yuna Nuñez"),
    "zulbeyrivero@gmail.com": generateAlertMessage("Zulbey Rivero"),
    "verac9730@gmail.com": generateAlertMessage("Carlos Vera"),
    "viankmeza@gmail.com": generateAlertMessage("Vianka Meza"),
    "ney_zapata@hotmail.com": generateAlertMessage("Ney Zapata"),
    "juancmoreirab@hotmail.com": generateAlertMessage("Juan Carlos Moreira"),
    "enriqueruiz68@hotmail.com": generateAlertMessage("Enrique Ruiz"),
    "joronues@hotmail.com": generateAlertMessage("Jhonny Nuñez"),
    "mabelchacon7@gmail.com": generateAlertMessage("Mabel Chacón"),
    "ingvictormacias_13@hotmail.com": generateAlertMessage("Victor Macias"),
    "luiswittong87@gmail.com": generateAlertMessage("Luis Wittong"),
    "marcosbenicha@gmail.com": generateAlertMessage("Marcos Benitez"),
    "edgargarcia9565@gmail.com": generateAlertMessage("Edgar García")
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