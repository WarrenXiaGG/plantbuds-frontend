import React from 'react';
import * as Notifications from 'expo-notifications';
import {View, StyleSheet, Text, Modal, Dimensions} from 'react-native';
import {Colors, Button} from 'react-native-paper';
import {Calendar as ReactCalendar} from 'react-native-calendars';
import {useState} from 'react';
import {RootState} from '../../store/store';
import {useSelector, useDispatch} from 'react-redux';
import SetFertilizeFreqModal from './SetFertilizeFreqModal';
import {updateFertilizeNotifHistory} from '../../store/plantgroup/actions';

interface Props {
  displayModal: boolean;
  onExit: () => void;
}

export default function SetFertilizeReminderModal(props: Props) {
  const {displayModal, onExit} = props;

  function setStartDateString() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime.split("T")[0];
  }

  const fertilize_history = useSelector((state: RootState) => state.plantgroup.fertilize_history);
  const fertilize_frequency = useSelector(
    (state: RootState) => state.plantgroup.fertilize_frequency
  );
  const [selectedDate, setSelectedDate] = useState(
    fertilize_history && fertilize_history.length > 0
      ? fertilize_history[0]
      : setStartDateString()
  );
  const [showFertilizeModal, setShowFertilizeModal] = useState(false);
  const [fertFreq, setFertFreq] = useState(fertilize_frequency);
  const plant_id = useSelector((state: RootState) => state.plantgroup.plant_id);
  const dispatch = useDispatch();

  function addDays(date, days) {
    const copy = new Date(Number(date));
    let datestring = '';
    copy.setDate(date.getDate() + days);
    datestring = copy.toISOString().split('T')[0];
    return datestring;
  }

  function pushNotifHistory() {
    // setup new water history array
    let fertilizeArray = [];
    let currDate = new Date(selectedDate);
    for (let i = 0; i < 5; i++) {
      fertilizeArray.push(addDays(currDate, fertFreq * i));
    }

    // update backend with water notification array
    dispatch(updateFertilizeNotifHistory(fertilizeArray, fertFreq, plant_id));
  }

  function clearNotifHistory() {
    dispatch(updateFertilizeNotifHistory([], 0, plant_id));
  }
  return (
    <Modal animationType="slide" transparent={true} visible={displayModal}>
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          <Button onPress={onExit}>Cancel</Button>
          <Text style={styles.reminderTitle}>Set Fertilize Reminder</Text>
          <ReactCalendar
            enableSwipeMonths={true}
            onDayPress={day => setSelectedDate(day.dateString)}
            current={new Date().toISOString().split('T')[0]}
            minDate={new Date()}
            markedDates={{
              [selectedDate]: {selected: true, marked: false, selectedColor: 'green'},
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayTextColor: 'white',
              todayTextColor: '#00adf5',
              dayTextColor: 'black',
              textDisabledColor: '#979797',
            }}
          />
          <View style={styles.frequencyContainer}>
            <Text style={styles.frequencyText}>Frequency:</Text>
            <Button
              icon={showFertilizeModal ? 'chevron-up' : 'chevron-down'}
              mode="contained"
              contentStyle={styles.contentStyle}
              labelStyle={styles.labelStyle}
              style={styles.freqButton}
              onPress={() => setShowFertilizeModal(true)}
            >
              {!fertFreq || fertFreq === 0
                ? 'Only once'
                : fertFreq === 1
                ? 'Every day'
                : 'Every ' + fertFreq.toString() + ' days'}
            </Button>
            <SetFertilizeFreqModal
              displayModal={showFertilizeModal}
              fertFreq={fertFreq}
              setFertFreq={setFertFreq}
              setShowModal={setShowFertilizeModal}
              onExit={() => setShowFertilizeModal(false)}
            />
          </View>
          <Button
            mode="contained"
            color={Colors.green400}
            onPress={() => {
              pushNotifHistory();
              onExit();
            }}
            style={styles.roundToggle}
          >
            <Text style={{color: Colors.white}}>Save</Text>
          </Button>
          <Button
            mode="contained"
            color={Colors.red300}
            onPress={() => {
              clearNotifHistory();
              onExit();
            }}
            style={styles.roundToggle}
          >
            <Text style={{color: Colors.white}}>Clear Reminder</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  // Specify the modal to appear from the bottom (dont change)
  bottomView: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  modalView: {
    width: windowWidth,
    height: windowHeight,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
  },
  reminderTitle: {
    fontSize: 22,
    alignSelf: 'center',
  },
  frequencyText: {
    fontSize: 18,
  },
  frequencyContainer: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    alignItems: 'center',
    left: windowWidth * 0.11,
    width: windowWidth * 0.6,
  },
  freqButton: {
    width: windowWidth * 0.32,
  },
  contentStyle: {
    backgroundColor: Colors.grey300,
    height: windowHeight * 0.04,
  },
  labelStyle: {
    fontSize: 9,
    color: 'black',
  },
  roundToggle: {
    borderRadius: 40,
    borderWidth: 2,
    padding: 4,
    marginHorizontal: 30,
    marginTop: 30,
    color: Colors.white,
  },
});
