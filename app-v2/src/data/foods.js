const FOODS = [
  { n: 'Pechuga de pollo', c2: 'PA', k: 165, p: 31, c: 0, f: 3.6, po: '100g' },
  { n: 'Carne de res molida', c2: 'PA', k: 250, p: 26, c: 0, f: 15, po: '100g' },
  { n: 'Tilapia', c2: 'PA', k: 128, p: 26, c: 0, f: 2.7, po: '100g' },
  { n: 'Atun en lata', c2: 'PA', k: 116, p: 25.5, c: 0, f: 1, po: '100g' },
  { n: 'Huevo entero', c2: 'PA', k: 78, p: 6.3, c: 0.6, f: 5.3, po: '1 unidad' },
  { n: 'Salmon', c2: 'PA', k: 208, p: 20, c: 0, f: 13, po: '100g' },
  { n: 'Yogur griego', c2: 'LA', k: 100, p: 17, c: 6, f: 0.7, po: '170g' },
  { n: 'Queso campesino', c2: 'LA', k: 98, p: 7, c: 1, f: 7.5, po: '30g' },
  { n: 'Leche entera', c2: 'LA', k: 150, p: 8, c: 12, f: 8, po: '240ml' },
  { n: 'Frijoles rojos', c2: 'LE', k: 225, p: 15.3, c: 40, f: 0.9, po: '1 taza' },
  { n: 'Lentejas', c2: 'LE', k: 230, p: 18, c: 40, f: 0.8, po: '1 taza' },
  { n: 'Arroz blanco', c2: 'CT', k: 206, p: 4.3, c: 45, f: 0.4, po: '1 taza' },
  { n: 'Papa criolla', c2: 'CT', k: 108, p: 2.5, c: 24, f: 0.1, po: '3 unid' },
  { n: 'Yuca', c2: 'CT', k: 160, p: 1.4, c: 38, f: 0.3, po: '100g' },
  { n: 'Platano verde', c2: 'CT', k: 200, p: 1.5, c: 50, f: 0.4, po: '1 unid' },
  { n: 'Arepa de maiz', c2: 'CT', k: 170, p: 3.5, c: 34, f: 2.5, po: '80g' },
  { n: 'Avena en hojuelas', c2: 'CT', k: 150, p: 5, c: 27, f: 2.6, po: '40g' },
  { n: 'Pasta', c2: 'CT', k: 220, p: 8, c: 43, f: 1.3, po: '1 taza' },
  { n: 'Quinoa', c2: 'CT', k: 222, p: 8.1, c: 39, f: 3.5, po: '1 taza' },
  { n: 'Banano', c2: 'FR', k: 105, p: 1.3, c: 27, f: 0.4, po: '1 unid' },
  { n: 'Manzana', c2: 'FR', k: 95, p: 0.5, c: 25, f: 0.3, po: '1 unid' },
  { n: 'Aguacate', c2: 'GF', k: 240, p: 3, c: 13, f: 22, po: '200g' },
  { n: 'Almendras', c2: 'GF', k: 170, p: 6, c: 6, f: 15, po: '30g' },
  { n: 'Aceite de oliva', c2: 'GF', k: 120, p: 0, c: 0, f: 14, po: '1 cda' },
  { n: 'Brocoli', c2: 'VE', k: 55, p: 3.7, c: 11, f: 0.6, po: '150g' },
  { n: 'Espinaca', c2: 'VE', k: 23, p: 2.9, c: 3.6, f: 0.4, po: '100g' },
  { n: 'Tomate', c2: 'VE', k: 22, p: 1.1, c: 4.8, f: 0.2, po: '120g' },
  { n: 'Proteina Whey', c2: 'SU', k: 120, p: 24, c: 3, f: 1.5, po: '1 scoop' },
  { n: 'Creatina', c2: 'SU', k: 0, p: 0, c: 0, f: 0, po: '5g' },
  { n: 'Granola', c2: 'CT', k: 210, p: 5, c: 34, f: 7, po: '50g' },
];

const FCAT = {
  PA: 'Proteinas animales',
  LA: 'Lacteos',
  LE: 'Legumbres',
  CT: 'Cereales y tuberculos',
  FR: 'Frutas',
  VE: 'Verduras',
  GF: 'Grasas y frutos secos',
  SU: 'Suplementos',
};

const FCATS = Object.keys(FCAT);

module.exports = { FOODS, FCAT, FCATS };
