import Slider from '@react-native-community/slider';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';

const formatTime = secs => {
  let minutes = Math.floor(secs / 60);
  let seconds = Math.ceil(secs - minutes * 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
};

const SliderComp = () => {
  const {position, duration} = useProgress();
  const handleChange = val => {
    console.log(val);
    TrackPlayer.seekTo(val);
  };
  return (
    <View style={styles.container}>
      <Slider
        style={styles.indicator}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        minimumTrackTintColor="#DDFBD2"
        maximumTrackTintColor="#BCEDF6"
        thumbTintColor="#6B7FD7"
        onSlidingComplete={handleChange}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

export default SliderComp;

const styles = StyleSheet.create({
  container: {marginHorizontal: 30},
  indicator: {width: '100%', height: 50},
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: -10,
    marginBottom: 20,
  },
  time: {
    color: '#DDFBD2',
  },
});
