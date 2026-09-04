/**
 * Cloudflare Worker — proxy para Anthropic API
 *
 * Configuración en Cloudflare Dashboard:
 *   Settings → Variables → Secrets → Añadir "ANTHROPIC_API_KEY" y "APP_SECRET"
 *
 * La app llama a este Worker; el Worker llama a Anthropic con la key secreta.
 * La key NUNCA queda en el APK.
 *
 * APP_SECRET evita que alguien fuera de la app llame el Worker directamente
 * (con curl, por ejemplo) y consuma tu crédito de Anthropic. No es
 * inviolable — igual queda embebido en el APK — pero sube la barrera de
 * "URL pública sin fricción" a "hay que decompilar el APK para encontrarlo".
 *
 * Variables en la app: EXPO_PUBLIC_PROXY_URL=https://<tu-worker>.workers.dev
 *                       EXPO_PUBLIC_APP_SECRET=<mismo valor que el secret APP_SECRET>
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

// Orígenes permitidos para llamadas desde navegador — la app móvil no manda
// Origin, así que esto solo importa si además publicas una versión web.
const ALLOWED_ORIGINS = ['https://jonnathanlopezarguello.github.io'];

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes('*') ? '*' : (ALLOWED_ORIGINS.includes(origin) ? origin : ''),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Método no permitido', { status: 405 });
    }

    // Solo la app conoce este secreto — bloquea llamadas directas al Worker
    const appSecret = request.headers.get('X-App-Secret');
    if (!env.APP_SECRET || appSecret !== env.APP_SECRET) {
      return new Response('No autorizado', { status: 401, headers: corsHeaders(origin) });
    }

    // Reenviar body tal cual a Anthropic, solo reemplazando la key
    let body;
    try {
      body = await request.text();
    } catch {
      return new Response('Body inválido', { status: 400 });
    }

    const anthropicRes = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body,
    });

    const resBody = await anthropicRes.text();

    return new Response(resBody, {
      status: anthropicRes.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  },
};
