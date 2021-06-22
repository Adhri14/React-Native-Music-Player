import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  StatusBar,
} from 'react-native';

import songs from './data.json';
import Controller from './Controller';
import TrackPlayer, {Capability, Event} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import SliderComp from './SliderComp';
import Icon from './assets/icon.png';

const {width, height} = Dimensions.get('window');

const Player = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const slider = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  const isReadyPlay = useRef(false);
  const index = useRef(0);
  const isItFromUser = useRef(true);

  // for tranlating the album art
  const position = useRef(Animated.divide(scrollX, width)).current;

  useEffect(() => {
    scrollX.addListener(({value}) => {
      const val = Math.round(value / width);

      setSongIndex(val);
    });

    TrackPlayer.setupPlayer().then(async () => {
      // The player is ready to be used
      // add the array of songs in the playlist
      await TrackPlayer.reset();
      await TrackPlayer.add(songs);
      TrackPlayer.play();
      isReadyPlay.current = true;

      await TrackPlayer.updateOptions({
        stopWithApp: false,
        alwaysPauseOnInterruption: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        jumpInterval: 10,
        icon: Icon,
      });
      //add listener on track change
      TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async e => {
        const trackId = (await TrackPlayer.getCurrentTrack()) - 1; //get the current id

        if (trackId !== index.current) {
          setSongIndex(trackId);
          isItFromUser.current = false;

          if (trackId > index.current) {
            goNext();
          } else {
            goPrv();
          }
          setTimeout(() => {
            isItFromUser.current = true;
          }, 200);
        }

        // isReadyPlay.current = true;
      });

      //monitor intterupt when other apps start playing music
      TrackPlayer.addEventListener(Event.RemoteDuck, e => {
        // console.log(e);
        if (e.paused) {
          // if pause true we need to pause the music
          TrackPlayer.pause();
        } else {
          TrackPlayer.play();
        }
      });
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (isReadyPlay.current && isItFromUser.current) {
      TrackPlayer.skip(songs[songIndex].id)
        .then(_ => {})
        .catch(e => console.log('error in changing track ', e));
    }
    index.current = songIndex;
  }, [songIndex]);

  const exitPlayer = async () => {
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.error('exitPlayer', error);
    }
  };

  const goNext = () => {
    slider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const goPrv = () => {
    slider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderItem = ({index, item}) => {
    return (
      <Animated.View
        style={{
          alignItems: 'center',
          width: width,
          transform: [
            {
              translateX: Animated.multiply(
                Animated.add(position, -index),
                -100,
              ),
            },
          ],
        }}>
        <Animated.Image
          // source={{uri: item.artwork}}
          source={{uri: item.artwork}}
          style={{width: 320, height: 320, borderRadius: 5}}
        />
      </Animated.View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#320E3B',
      }}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={{height: 350}}>
          <Animated.FlatList
            ref={slider}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            data={songs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
          />
        </SafeAreaView>
        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>
        <SliderComp />
        <Controller onNext={goNext} onPrv={goPrv} />
      </SafeAreaView>
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#6B7FD7',
  },
  artist: {
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#DDFBD2',
  },
  container: {
    justifyContent: 'space-evenly',
    height: height,
    maxHeight: 500,
  },
});
