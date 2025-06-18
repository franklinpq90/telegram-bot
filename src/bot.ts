// bot.ts
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Bot } from 'grammy';
import fetch from 'node-fetch';
import crypto from 'crypto';

const bot = new Bot("6679971071:AAHnGniWgczlpj7PZ88j1mh9h05OOtjwJjo");
const USER_ID = 352099074;
const GROUP_ID = -1001944748227;
const WAKE_UP_DELAY = 2000;

const app = express();
app.use(express.json());

let accessToken = '';
let tokenExpiry = 0;

async function getTuyaAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) return accessToken;

  const clientId = "g5phehaqdn5pvdmvfp48";
  const secret = "49a2d1a17bb74bf58b9c7d896748c40f";
  const t = now.toString();
  const signStr = clientId + t;
  const sign = crypto.createHmac('sha256', secret).update(signStr).digest('hex').toUpperCase();

  const res = await fetch('https://openapi.tuyaus.com/v1.0/token?grant_type=1', {
    method: 'GET',
    headers: {
      'client_id': clientId,
      'sign': sign,
      'sign_method': 'HMAC-SHA256',
      't': t,
    }
  });

  const data = await res.json();
  accessToken = data.result.access_token;
  tokenExpiry = now + data.result.expire_time * 1000;
  return accessToken;
}

async function switchDevice(deviceId: string, command: boolean): Promise<boolean> {
  const token = await getTuyaAccessToken();
  const clientId = "g5phehaqdn5pvdmvfp48";
  const secret = "49a2d1a17bb74bf58b9c7d896748c40f";
  const t = Date.now().toString();
  const signStr = clientId + token + t;
  const sign = crypto.createHmac('sha256', secret).update(signStr).digest('hex').toUpperCase();

  const response = await fetch(`https://openapi.tuyaus.com/v1.0/iot-03/devices/${deviceId}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'client_id': clientId,
      'access_token': token,
      'sign': sign,
      'sign_method': 'HMAC-SHA256',
      't': t
    },
    body: JSON.stringify({
      commands: [{ code: 'switch_1', value: command }]
    })
  });

  const result = await response.json();
  return result.success;
}

app.post('/toggle-device', async (req, res) => {
  try {
    const success = await switchDevice("eb2a758589951542e4qhi3", true);
    if (success) {
      bot.api.sendMessage(USER_ID, '✅ El ventilador fue activado desde la web.');
      return res.json({ ok: true });
    } else {
      return res.status(500).json({ error: 'Error al enviar comando a Tuya' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fallo inesperado' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot activo en puerto ${PORT}`);
});

if (process.env.NODE_ENV !== 'production') {
  bot.start();
}

  
