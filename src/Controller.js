import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

const Controller = ({onNext, onPrv}) => {
  const playBack = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState('loading');

  useEffect(() => {
    if (playBack === 3) {
      setIsPlaying('playing');
    } else if (playBack === 2) {
      setIsPlaying('paused');
    } else {
      setIsPlaying('loading');
    }
  }, [playBack]);

  const renderPlayBtn = () => {
    switch (isPlaying) {
      case 'playing':
        return <MaterialIcons name="pause" size={45} color="#6B7FD7" />;
      case 'paused':
        return <MaterialIcons name="play-arrow" color="#DDFBD2" size={45} />;
      default:
        return <ActivityIndicator size={45} color="black" color="#DDFBD2" />;
    }
  };

  const onPlayPause = () => {
    console.log(playBack);
    if (playBack === 3) {
      TrackPlayer.pause();
    } else if (playBack === 2) {
      TrackPlayer.play();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrv}>
        <MaterialIcons name="skip-previous" size={45} color="#6B7FD7" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPlayPause}>
        {renderPlayBtn()}
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext}>
        <MaterialIcons name="skip-next" size={45} color="#6B7FD7" />
      </TouchableOpacity>
    </View>
  );
};

export default Controller;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
