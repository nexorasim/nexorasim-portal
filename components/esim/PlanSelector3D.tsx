import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function PlanSelector3D({ plans, onSelect }: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const translateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateY: `${rotateY.value}deg` },
      { perspective: 1000 }
    ]
  }));

  const onGestureEvent = (event: any) => {
    translateX.value = event.nativeEvent.translationX;
    rotateY.value = (event.nativeEvent.translationX / width) * 45;
  };

  const onGestureEnd = (event: any) => {
    const velocity = event.nativeEvent.velocityX;
    if (Math.abs(velocity) > 500) {
      const direction = velocity > 0 ? -1 : 1;
      const newIndex = Math.max(0, Math.min(plans.length - 1, selectedIndex + direction));
      setSelectedIndex(newIndex);
    }
    translateX.value = withSpring(0);
    rotateY.value = withSpring(0);
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <Card style={styles.card3D}>
            <Card.Content>
              <Text variant="headlineMedium">{plans[selectedIndex]?.name}</Text>
              <Text variant="bodyLarge">{plans[selectedIndex]?.country}</Text>
              <Text variant="titleLarge">${plans[selectedIndex]?.price}</Text>
              <Button mode="contained" onPress={() => onSelect(plans[selectedIndex])}>
                Select Plan
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardContainer: { width: width * 0.8, height: 300 },
  card3D: { 
    flex: 1, 
    elevation: 20, 
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20
  }
});