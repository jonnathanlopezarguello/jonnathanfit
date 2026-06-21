import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { ARCH, POSES } from '../data/demos';

/**
 * Interpolate all joint positions between pose A and pose B.
 * Each pose is an object of { jointName: [x, y], ... }.
 */
function interpolatePose(a, b, t) {
  const result = {};
  for (const key of Object.keys(a)) {
    const [ax, ay] = a[key];
    const [bx, by] = b[key];
    result[key] = [ax + (bx - ax) * t, ay + (by - ay) * t];
  }
  return result;
}

export default function ExerciseDemo({
  exerciseName,
  width = 160,
  height = 174,
  theme,
}) {
  const archetype = ARCH[exerciseName];

  if (!archetype || !POSES[archetype]) {
    return (
      <View
        style={{
          width,
          height,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: theme.text3, fontSize: 12 }}>
          Sin demo
        </Text>
      </View>
    );
  }

  const { props: propLines, eq, a, b } = POSES[archetype];

  const progress = useRef(new Animated.Value(0)).current;
  const [pose, setPose] = useState(() => interpolatePose(a, b, 0));

  useEffect(() => {
    const listener = progress.addListener(({ value }) => {
      setPose(interpolatePose(a, b, value));
    });

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      progress.removeListener(listener);
    };
  }, [archetype]);

  const { S, H, K, A: An, T, E, W, hd } = pose;

  // Render equipment at the relevant joint
  const renderEquipment = () => {
    if (!eq) return null;

    const eqColor = theme.text3;
    const sw = 2;

    switch (eq) {
      case 'barW': {
        // Horizontal bar at wrist position
        return (
          <Line
            x1={W[0] - 14}
            y1={W[1]}
            x2={W[0] + 14}
            y2={W[1]}
            stroke={eqColor}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        );
      }
      case 'dbW': {
        // Dumbbell (circle) at wrist
        return (
          <Circle
            cx={W[0]}
            cy={W[1]}
            r={5}
            stroke={eqColor}
            strokeWidth={sw}
            fill="none"
          />
        );
      }
      case 'barS': {
        // Barbell at shoulder
        return (
          <Circle
            cx={S[0]}
            cy={S[1]}
            r={6}
            stroke={eqColor}
            strokeWidth={sw}
            fill="none"
          />
        );
      }
      case 'barH': {
        // Barbell at hip
        return (
          <Circle
            cx={H[0]}
            cy={H[1]}
            r={6}
            stroke={eqColor}
            strokeWidth={sw}
            fill="none"
          />
        );
      }
      case 'wheelW': {
        // Ab wheel (bigger circle) at wrist
        return (
          <Circle
            cx={W[0]}
            cy={W[1]}
            r={9}
            stroke={eqColor}
            strokeWidth={sw}
            fill="none"
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 220 240">
        {/* Static prop lines (bench, ground, etc.) */}
        {propLines &&
          propLines.map((p, i) => (
            <Line
              key={`prop-${i}`}
              x1={p[0]}
              y1={p[1]}
              x2={p[2]}
              y2={p[3]}
              stroke={theme.line2}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}

        {/* Body lines */}
        {/* Torso: S -> H */}
        <Line
          x1={S[0]}
          y1={S[1]}
          x2={H[0]}
          y2={H[1]}
          stroke={theme.text2}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Thigh: H -> K */}
        <Line
          x1={H[0]}
          y1={H[1]}
          x2={K[0]}
          y2={K[1]}
          stroke={theme.text2}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Calf: K -> A */}
        <Line
          x1={K[0]}
          y1={K[1]}
          x2={An[0]}
          y2={An[1]}
          stroke={theme.text2}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Foot: A -> T */}
        <Line
          x1={An[0]}
          y1={An[1]}
          x2={T[0]}
          y2={T[1]}
          stroke={theme.text2}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Arm lines */}
        {/* Upper arm: S -> E */}
        <Line
          x1={S[0]}
          y1={S[1]}
          x2={E[0]}
          y2={E[1]}
          stroke={theme.text3}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Forearm: E -> W */}
        <Line
          x1={E[0]}
          y1={E[1]}
          x2={W[0]}
          y2={W[1]}
          stroke={theme.text3}
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Head */}
        <Circle cx={hd[0]} cy={hd[1]} r={10} fill={theme.text2} />

        {/* Equipment */}
        {renderEquipment()}
      </Svg>
    </View>
  );
}
