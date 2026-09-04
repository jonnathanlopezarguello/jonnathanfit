import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../theme';

const CATEGORIES = [
  {
    title: 'ENTRENAMIENTO Y VOLUMEN',
    refs: [
      { num: 1, text: 'Schoenfeld BJ, Ogborn D, Krieger JW. "Dose-response relationship between weekly resistance training volume and increases in muscle mass." J Sports Sci. 2017;35(11):1073-1082.' },
      { num: 2, text: 'Israetel M, Hoffmann J, Smith CW. "Scientific Principles of Hypertrophy Training." Renaissance Periodization. 2021.' },
      { num: 3, text: 'Schoenfeld BJ. "The mechanisms of muscle hypertrophy and their application to resistance training." J Strength Cond Res. 2010;24(10):2857-2872.' },
      { num: 4, text: 'Nippard J. "The Science Applied Program." Evidence-based training methodology. 2023.' },
    ],
  },
  {
    title: 'NUTRICION Y MACROS',
    refs: [
      { num: 5, text: 'Morton RW, Murphy KT, McKellar SR, et al. "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength." Br J Sports Med. 2018;52(6):376-384.' },
      { num: 6, text: 'Helms ER, Aragon AA, Fitschen PJ. "Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation." J Int Soc Sports Nutr. 2014;11:20.' },
      { num: 7, text: 'Mifflin MD, St Jeor ST, Hill LA, et al. "A new predictive equation for resting energy expenditure in healthy individuals." Am J Clin Nutr. 1990;51(2):241-247.' },
      { num: 8, text: 'ICBF. "Tabla de Composicion de Alimentos Colombianos (TCAC)." Instituto Colombiano de Bienestar Familiar. 2018.' },
    ],
  },
  {
    title: 'SUPLEMENTACION',
    refs: [
      { num: 9, text: 'Kreider RB, Kalman DS, Antonio J, et al. "International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation." J Int Soc Sports Nutr. 2017;14:18.' },
      { num: 10, text: 'Jager R, Kerksick CM, Campbell BI, et al. "International Society of Sports Nutrition Position Stand: protein and exercise." J Int Soc Sports Nutr. 2017;14:20.' },
      { num: 11, text: 'Guest NS, VanDusseldorp TA, Nelson MT, et al. "International society of sports nutrition position stand: caffeine and exercise performance." J Int Soc Sports Nutr. 2021;18:1.' },
    ],
  },
  {
    title: 'COMPOSICION CORPORAL',
    refs: [
      { num: 12, text: 'Hodgdon JA, Beckett MB. "Prediction of percent body fat for U.S. Navy personnel from body circumferences and height." Naval Health Research Center Report No. 84-11. 1984.' },
      { num: 13, text: 'Jackson AS, Pollock ML. "Generalized equations for predicting body density of men." Br J Nutr. 1978;40(3):497-504.' },
      { num: 14, text: 'ENSIN. "Encuesta Nacional de la Situacion Nutricional en Colombia." Ministerio de Salud. 2015.' },
    ],
  },
  {
    title: 'SOBRECARGA PROGRESIVA',
    refs: [
      { num: 15, text: 'Zourdos MC, Klemp A, Dolan C, et al. "Novel Resistance Training-Specific Rating of Perceived Exertion Scale Measuring Repetitions in Reserve." J Strength Cond Res. 2016;30(1):267-275.' },
      { num: 16, text: 'Helms ER, Cronin J, Storey A, Zourdos MC. "Application of the Repetitions in Reserve-Based Rating of Perceived Exertion Scale for Resistance Training." Strength Cond J. 2016;38(4):42-49.' },
    ],
  },
];

export default function FuentesScreen({ theme }) {
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.supra, { color: theme.text3 }]}>EVIDENCIA CIENTIFICA</Text>
      <Text style={[styles.title, { color: theme.text }]}>Fuentes</Text>

      {CATEGORIES.map((cat) => (
        <View key={cat.title}>
          <Text style={[styles.sectionLabel, { color: theme.text3 }]}>{cat.title}</Text>
          {cat.refs.map((ref) => (
            <View key={ref.num} style={[styles.refCard, { borderColor: theme.line }]}>
              <Text style={[styles.refNum, { color: theme.accent }]}>{ref.num}</Text>
              <Text style={[styles.refText, { color: theme.text2 }]}>{ref.text}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 60 },
  supra: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  refCard: {
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  refNum: {
    fontSize: 14,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    marginRight: spacing.md,
    minWidth: 20,
  },
  refText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
