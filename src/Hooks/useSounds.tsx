import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

export default function useSounds() {
  const [blip1, setBlip1] = useState<Sound>();
  const [blip2, setBlip2] = useState<Sound>();

  const [blip3, setBlip3] = useState<Sound>();
  const [blip4, setBlip4] = useState<Sound>();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    setBlip1(
      new Sound(require('../Sounds/blip1.wav'), Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      }),
    );
    setBlip2(
      new Sound(require('../Sounds/blip2.wav'), Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      }),
    );

    setBlip3(
      new Sound(require('../Sounds/blip3.wav'), Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      }),
    );
    setBlip4(
      new Sound(require('../Sounds/blip4.wav'), Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      }),
    );
  };


  return [blip1, blip2, blip3, blip4]
}
