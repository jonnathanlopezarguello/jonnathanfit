/**
 * Cloudflare Worker — proxy para Anthropic API
 *
 * Configuración en Cloudflare Dashboard:
 *   Settings → Variables → Secrets → Añadir "ANTHROPIC_API_KEY"
 *
 * La app llama a este Worker; el Worker llama a Anthropic con la key secreta.
 * La key NUNCA queda en el APK.
 *
 * Variable en la app: EXPO_PUBLIC_PROXY_URL=https://<tu-worker>.workers.dev
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

// Orígenes permitidos — agrega tu dominio si publicas versión web
const ALLOWED_ORIGINS = ['*'];

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
