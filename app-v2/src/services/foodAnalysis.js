const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

export async function analyzeFoodPhoto(base64Image, mediaType = 'image/jpeg') {
  if (!API_KEY) throw new Error('API key no configurada');

  const prompt = `Eres un nutricionista experto. Analiza esta foto de comida e identifica TODOS los alimentos visibles.
Para cada alimento proporciona una estimación nutricional realista.
Responde ÚNICAMENTE con JSON válido (sin markdown, sin texto adicional) con este formato exacto:
{
  "foods": [
    {
      "n": "nombre del alimento en español",
      "po": "porción estimada (ej: 1 porción, 150g, 1 taza, 2 unidades)",
      "g": 150,
      "k": 300,
      "p": 25.0,
      "c": 20.0,
      "f": 10.0
    }
  ]
}
Donde: g=gramos estimados, k=kcal, p=proteína(g), c=carbohidratos(g), f=grasa(g).
Sé específico con los nombres (ej: "Arroz blanco cocido" no solo "arroz").
Si ves platos colombianos o latinoamericanos, identifícalos correctamente.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Image },
          },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Error API (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = (data.content?.[0]?.text || '').trim();
  if (!text) throw new Error('Respuesta vacía de la IA');

  // Strip markdown code blocks if present
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(clean);
  return parsed.foods || [];
}
