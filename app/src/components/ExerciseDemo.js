import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text } from 'react-native';
import { ARCH, POSES } from '../data/demos';

let SvgLib = null;
try {
  SvgLib = require('react-native-svg');
} catch (e) {}

function interpolatePose(a, b, t) {
  const result = {};
  for (const key of Object.keys(a)) {
    const [ax, ay] = a[key];
    const [bx, by] = b[key];
    result[key] = [ax + (bx - ax) * t, ay + (by - ay) * t];
  }
  return result;
}

export default function ExerciseDemo({ exerciseName, width = 160, height = 174, theme }) {
  const archetype = ARCH[exerciseName];
  const poseData = archetype ? POSES[archetype] : null;
  const a = poseData ? poseData.a : null;
  const b = poseData ? poseData.b : null;

  const progress = useRef(new Animated.Value(0)).current;
  const [pose, setPose] = useState(() => a && b ? interpolatePose(a, b, 0) : null);

  useEffect(() => {
    if (!a || !b) return;
    setPose(interpolatePose(a, b, 0));
    progress.setValue(0);

    const listener = progress.addListener(({ value }) => {
      setPose(interpolatePose(a, b, value));
    });

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1, duration: 1300,
          easing: Easing.inOut(Easing.ease), useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0, duration: 1300,
          easing: Easing.inOut(Easing.ease), useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => { animation.stop(); progress.removeListener(listener); };
  }, [archetype]);

  if (!SvgLib || !poseData || !pose) {
    return (
      <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.text3, fontSize: 12 }}>Sin demo</Text>
      </View>
    );
  }

  const { Svg, Line, Circle } = SvgLib;
  const { props: propLines, eq } = poseData;
  const { S, H, K, A: An, T, E, W, hd } = pose;

  let equipment = null;
  if (eq === 'barW') {
    equipment = <Line x1={W[0] - 14} y1={W[1]} x2={W[0] + 14} y2={W[1]} stroke={theme.text3} strokeWidth={2} strokeLinecap="round" />;
  } else if (eq === 'dbW') {
    equipment = <Circle cx={W[0]} cy={W[1]} r={5} stroke={theme.text3} strokeWidth={2} fill="none" />;
  } else if (eq === 'barS') {
    equipment = <Circle cx={S[0]} cy={S[1]} r={6} stroke={theme.text3} strokeWidth={2} fill="none" />;
  } else if (eq === 'barH') {
    equipment = <Circle cx={H[0]} cy={H[1]} r={6} stroke={theme.text3} strokeWidth={2} fill="none" />;
  } else if (eq === 'wheelW') {
    equipment = <Circle cx={W[0]} cy={W[1]} r={9} stroke={theme.text3} strokeWidth={2} fill="none" />;
  }

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 220 240">
        {propLines && propLines.map((p, i) => (
          <Line key={`p${i}`} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke={theme.line2} strokeWidth={2} strokeLinecap="round" />
        ))}
        <Line x1={S[0]} y1={S[1]} x2={H[0]} y2={H[1]} stroke={theme.text2} strokeWidth={3} strokeLinecap="round" />
        <Line x1={H[0]} y1={H[1]} x2={K[0]} y2={K[1]} stroke={theme.text2} strokeWidth={3} strokeLinecap="round" />
        <Line x1={K[0]} y1={K[1]} x2={An[0]} y2={An[1]} stroke={theme.text2} strokeWidth={3} strokeLinecap="round" />
        <Line x1={An[0]} y1={An[1]} x2={T[0]} y2={T[1]} stroke={theme.text2} strokeWidth={3} strokeLinecap="round" />
        <Line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} stroke={theme.text3} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1={E[0]} y1={E[1]} x2={W[0]} y2={W[1]} stroke={theme.text3} strokeWidth={2.5} strokeLinecap="round" />
        <Circle cx={hd[0]} cy={hd[1]} r={10} fill={theme.text2} />
        {equipment}
      </Svg>
    </View>
  );
}
