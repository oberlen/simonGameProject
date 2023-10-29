import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {hideModal} from '../Features/modalSlice';
import {
  Text,
  View,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

type Props = {
  saveScore: (name: string, score: number) => Promise<void>;
  score: number;
};

const NameModal = ({saveScore, score}: Props) => {
  const dispatch = useDispatch();
  const [playerName, setPlayerName] = useState('');

  const handleHideModal = () => {
    saveScore(playerName, score);
    dispatch(hideModal());
  };

  const resultsModalVisible = useSelector(
    (state: RootState) => state.nameModal.showModal,
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={resultsModalVisible}
      onRequestClose={() => {
        dispatch(hideModal());
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={{height: 40, color: 'black'}}
            placeholder="Enter Your Name"
            onChangeText={e => setPlayerName(e)}
            defaultValue={playerName}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleHideModal}>
            <Text style={styles.textStyle}>Show Results</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 100,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
});
export default NameModal;
