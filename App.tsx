import React,  {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {RootState, store} from './store';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {appendElement} from './src/Features/sequenceSlice';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import useRandomSequence from './src/Hooks/useRandomSequence';
import Highscores from './src/Components/Highscores';
import {LogBox} from 'react-native';
import useSounds from './src/Hooks/useSounds';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={App as any} />
          <Stack.Screen name="Highscores" component={Highscores as any} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
};

const Stack = createStackNavigator();
              
export type RootStackParamList = {
  Home: undefined;
  Highscores: {
    score: number;
    restartGame: () => void;
  };
};

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const App = ({navigation}: Props) => {
  const [clickedColor, setClickedColor] = useState<number>();
  const dispatch = useDispatch();
  const nameModalVisible = useSelector(
    (state: RootState) => state.nameModal.showModal,
  );
  const currentColor = useSelector(
    (state: RootState) => state.simonSequence.currentColor,
  );
  const {isActive, score, restartGame, simonSpeaks} = useRandomSequence();
  const blip = useSounds();
  useEffect(() => {
    nameModalVisible &&
      navigation.navigate(
        'Highscores' as never,
        {
          score: score,
          restartGame: restartGame,
        } as never,
      );
  }, [nameModalVisible]);

  const handleClick = (number: number) => {
    !simonSpeaks && isActive && dispatch(appendElement(number));
  };

  const handlePressIn = (colorId: number) => {
    if (!simonSpeaks && isActive) {
      blip[colorId - 1]?.play();
      setClickedColor(colorId);
    }
  };

  const ColorBox = (
    colorId: number,
    colorStringIn: string,
    colorStringOut: string,
  ) => {
    return (
      <Pressable
        onPress={() => handleClick(colorId)}
        onPressIn={() => handlePressIn(colorId)}
        onPressOut={() => setClickedColor(-1)}
        style={{
          flex: 1,
          backgroundColor:
            currentColor === colorId || clickedColor === colorId
              ? colorStringIn
              : colorStringOut,
        }}></Pressable>
    );
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          height: '100%',
        }}>
        <View style={styles.colorContainer}>
          <View style={styles.circle}>
            {!isActive ? (
              <Pressable onPress={restartGame} style={styles.startContainer}>
                <Text style={styles.startText}>Start</Text>
              </Pressable>
            ) : (
              <Text style={styles.score}>{score}</Text>
            )}
          </View>
          <View style={styles.colorRow}>
            {ColorBox(1, 'rgb(0,225,0)', 'rgb(0,50,0)')}
            {ColorBox(2, 'rgb(225,0,0)', 'rgb(50,0,0)')}
          </View>
          <View style={styles.colorRow}>
            {ColorBox(3, 'rgb(225,225,0)', 'rgb(50,50,0)')}
            {ColorBox(4, 'rgb(0,0,225)', 'rgb(0,0,50)')}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  score: {
    fontSize: 48,
    textAlign: 'center',
    margin: '10%',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  startText: {
    color: 'white',
    fontSize: 30,
  },
  circle: {
    height: 100,
    borderRadius: 100,
    width: 150,
    position: 'absolute',
    top: '58%',
    transform: [{translateY: -100}],
    zIndex: 1,
    left: 130,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(0,0,0)',
  },
  startContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  colorContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  colorRow: {
    display: 'flex',
    flexDirection: 'row',

    height: '50%',
  },
});

export default AppWrapper;
