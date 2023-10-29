import {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {showModal} from '../Features/modalSlice';
import {resetUserSequence} from '../Features/sequenceSlice';
import {triggerColor} from '../Features/simonSlice';
import useSounds from '../Hooks/useSounds';
const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type ReturnedTypes = {
  isActive: boolean;
  score: number;
  next: () => void;
  restartGame: () => void;
  simonSpeaks: boolean;
};

const useRandomSequence = (): ReturnedTypes => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [simonSpeaks, setSimonSpeaks] = useState(false);
  const _maxNum = 4;
  const initialRender = useRef(true);
  const enteredSequence = useSelector(
    (state: RootState) => state.userSequence.sequence,
  );
  const dispatch = useDispatch();
  var score = sequence.length - 1;
  const blip = useSounds();

  useEffect(() => {
    if (enteredSequence.length > 0) {
      let isEqual = compareSequence(enteredSequence);
      isEqual === true && enteredSequence.length === sequence.length && next();
    }
  }, [enteredSequence]);

  useEffect(() => {
    initialRender.current === true && next();
    initialRender.current = false;
  }, [initialRender.current]);

  useEffect(() => {
    triggerSimonSpeaking();
  }, [sequence, isActive]);

  const next = async () => {
    dispatch(resetUserSequence());
    let nextElement = randomInteger(1, _maxNum);
    setSequence(sequence => [...sequence, nextElement]);
  };

  const abortGame = () => {
    setIsActive(false);
    dispatch(showModal());
  };

  const restartGame = () => {
    setSequence([]);
    initialRender.current = true;
    setIsActive(true);
  };

  /**
   * compareSequence gets an array representing the user's entered sequence
   * and comperes each element of the array with simon's random sequence (sequence state variable)
   * @param userSequence
   * @returns a boolean value representing if the sequence is equal to simon's.
   */
  const compareSequence = (userSequence: number[]): boolean => {
    let isEqual = false;
    if (sequence.length > 0) {
      sequence.forEach((element, idx) => {
        if (element != userSequence[idx] && userSequence[idx] != undefined)
          return abortGame();
        isEqual = true;
      });
    } else return false;
    return isEqual;
  };

  const triggerSimonSpeaking = async () => {
    if (isActive) {
      setSimonSpeaks(true);
      await triggerColorsInSequence();
      setSimonSpeaks(false);
    }
  };

  const triggerColorsInSequence = async () => {
    return new Promise(async resolve => {
      let i;
      await new Promise(resolve => setTimeout(resolve, 500));
      for (i = 0; i < sequence.length; i++) {
        dispatch(triggerColor(-1));
        await new Promise(resolve => setTimeout(resolve, 300));
        dispatch(triggerColor(sequence[i]));
        blip[sequence[i] - 1]?.play();
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      dispatch(triggerColor(-1));
      resolve('done');
    });
  };
  return {isActive, score, next, restartGame, simonSpeaks};
};
export default useRandomSequence;
