import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import crypto from 'crypto';
import axios from 'axios';

const app = express();
app.use(express.json());

// Variables de entorno desde Render
const CLIENT_ID = process.env.TUYA_ACCESS_ID || '';
const CLIENT_SECRET = process.env.TUYA_ACCESS_SECRET || '';
const DEVICE_ID = process.env.TUYA_DEVICE_ID || '';
const COMMAND_CODE = process.env.TUYA_DEVICE_COMMAND_CODE || 'switch_1';

// Función para generar la firma HMAC-SHA256
function getTuyaSignature(clientId: string, clientSecret: string, timestamp: string): string {
  const message = clientId + timestamp;
  return crypto.createHmac('sha256', clientSecret).update(message).digest('hex').toUpperCase();
}

// Ruta para encender el ventilador
app.post('/encender-ventilador', async (req, res) => {
  try {
    const timestamp = Date.now().toString();
    const sign = getTuyaSignature(CLIENT_ID, CLIENT_SECRET, timestamp);

    // Paso 1: obtener access_token
    const tokenResponse = await axios.get(
      'https://openapi.tuyaus.com/v1.0/token?grant_type=1',
      {
        headers: {
          'client_id': CLIENT_ID,
          'sign': sign,
          't': timestamp,
          'sign_method': 'HMAC-SHA256',
        },
      }
    );

    const accessToken = tokenResponse.data.result.access_token;

    // Paso 2: enviar comando al dispositivo
    const commandResponse = await axios.post(
      `https://openapi.tuyaus.com/v1.0/devices/${DEVICE_ID}/commands`,
      {
        commands: [
          {
            code: COMMAND_CODE,
            value: true,
          },
        ],
      },
      {
        headers: {
          'client_id': CLIENT_ID,
          'sign': sign,
          't': timestamp,
          'sign_method': 'HMAC-SHA256',
          'access_token':_
