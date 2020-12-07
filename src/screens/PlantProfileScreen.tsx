import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  PixelRatio,
  Switch,
} from 'react-native';
import {Text, Colors, IconButton, Button, FAB} from 'react-native-paper';
import {HeaderBackButton} from '@react-navigation/stack';
import {updateTaskHistory, setEditedEntry, resetPlantState, setEditedNotif} from '../../store/plantgroup/actions';
import {RootState} from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import SetWaterReminderModal from '../components/SetWaterReminderModal';
import SetRepotReminderModal from '../components/SetRepotReminderModal';
import SetFertilizeReminderModal from '../components/SetFertilizeReminderModal';
import AddEntryModal from '../components/AddEntryModal';
import {Calendar as ReactCalendar} from 'react-native-calendars';
import {State} from 'react-native-gesture-handler';

// declare types for your props here
interface Props {
  navigation: any;
  route: any;
  plantID: number;
}

var entries = {};

const greenBlueBrown = {
  container: {
    borderWidth: 4,
    borderBottomColor: Colors.lightBlue300,
    borderTopColor: Colors.green300,
    borderLeftColor: Colors.brown300,
    borderRightColor: Colors.lightBlue300,
  },
  text: {
    bottom: 3,
  },
};
const brown = {
  container: {
    borderWidth: 4,
    borderColor: Colors.brown300,
  },
  text: {
    bottom: 3,
  },
};
const green = {
  container: {
    borderWidth: 4,
    borderColor: Colors.green300,
  },
  text: {
    bottom: 3,
  },
};
const blue = {
  container: {
    borderWidth: 4,
    borderColor: Colors.lightBlue300,
  },
  text: {
    bottom: 3,
  },
};

const blueBrown = {
  container: {
    borderWidth: 4,
    borderBottomColor: Colors.lightBlue300,
    borderTopColor: Colors.brown300,
    borderLeftColor: Colors.lightBlue300,
    borderRightColor: Colors.brown300,
  },
  text: {
    bottom: 3,
  },
};
const blueGreen = {
  container: {
    borderWidth: 4,
    borderBottomColor: Colors.lightBlue300,
    borderTopColor: Colors.green300,
    borderLeftColor: Colors.lightBlue300,
    borderRightColor: Colors.green300,
  },
  text: {
    bottom: 3,
  },
};
const greenBrown = {
  container: {
    borderWidth: 4,
    borderBottomColor: Colors.green300,
    borderTopColor: Colors.brown300,
    borderLeftColor: Colors.green300,
    borderRightColor: Colors.brown300,
  },
  text: {
    bottom: 3,
  },
};

export default function PlantProfileScreen(props: Props) {
  const {navigation, route} = props;
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [markings, setMarkings] = useState({});
  const [waterStatus, setWaterStatus] = useState(false);
  const [repotStatus, setRepotStatus] = useState(false);
  const [fertilizeStatus, setFertilizeStatus] = useState(false);

  const [displayAddEntryModal, setDisplayAddEntryModal] = useState(false);
  const [displayWaterModal, setDisplayWaterModal] = useState(false);
  const [displayRepotModal, setDisplayRepotModal] = useState(false);
  const [displayFertilizeModal, setDisplayFertilizeModal] = useState(false);

  const plant_name = useSelector((state: RootState) => state.plantgroup.plant_name);
  const plant_id = useSelector((state: RootState) => state.plantgroup.plant_id);
  const nickname = useSelector((state: RootState) => state.plantgroup.nickname);
  const photo = useSelector((state: RootState) => state.plantgroup.photo);
  const notes = useSelector((state: RootState) => state.plantgroup.notes);
  const history = useSelector((state: RootState) => state.plantgroup.history);
  const water_history = useSelector((state: RootState) => state.plantgroup.water_history);
  const repot_history = useSelector((state: RootState) => state.plantgroup.repot_history);
  const fertilize_history = useSelector((state: RootState) => state.plantgroup.fertilize_history);
  const editedEntry = useSelector((state: RootState) => state.plantgroup.editedEntry);
  const editedNotif = useSelector((state: RootState) => state.plantgroup.editedNotif);

  const dispatch = useDispatch();
  let token = '';
  const parseEntries = () => {
    let localHistory = [];
    for (const date in entries) {
      // extract date
      let s = date + ':';

      // extract boolean values
      for (let i = 0; i < 2; i++) {
        s += entries[date][i] + ',';
      }
      s += entries[date][2];

      // push string that contains date and boolean values encoded in it to history array
      localHistory.push(s);
    }

    return localHistory;
  };

  const loadEntries = () => {
    entries = {};
    if (history != null) {
      for (let i = 0; i < history.length; i++) {
        let booleanArr = [];

        // extract the date from the string
        let booleanString = history[i].split(':')[1];

        // extract the boolean values and store them in an array
        for (let j = 0; j < 3; j++) {
          booleanArr.push(JSON.parse(booleanString.split(',')[j]));
        }

        // pair the boolean array with the extracted date
        entries[history[i].split(':')[0]] = booleanArr;
      }
    } else {
      entries = {};
    }
  };

  const updateCalendarMarkings = () => {
    var markings = {};
    var selected = false;
    for (const [date, value] of Object.entries(entries)) {
      var entry = {};
      //Deep copy shenanigans
      if (value[0] == true && value[1] == false && value[2] == false) {
        entry['customStyles'] = JSON.parse(JSON.stringify(blue));
      } else if (value[0] == false && value[1] == true && value[2] == false) {
        entry['customStyles'] = JSON.parse(JSON.stringify(brown));
      } else if (value[0] == false && value[1] == false && value[2] == true) {
        entry['customStyles'] = JSON.parse(JSON.stringify(green));
      } else if (value[0] == true && value[1] == true && value[2] == false) {
        entry['customStyles'] = JSON.parse(JSON.stringify(blueBrown));
      } else if (value[0] == true && value[1] == false && value[2] == true) {
        entry['customStyles'] = JSON.parse(JSON.stringify(blueGreen));
      } else if (value[0] == false && value[1] == true && value[2] == true) {
        entry['customStyles'] = JSON.parse(JSON.stringify(greenBrown));
      } else if (value[0] == true && value[1] == true && value[2] == true) {
        entry['customStyles'] = JSON.parse(JSON.stringify(greenBlueBrown));
      } else {
      }
      if (date === selectedDate) {
        entry['selected'] = true;
        selected = true;
      }
      markings[date] = entry;
    }
    if (!selected) {
      markings[selectedDate] = { selected: true };
    }
    setMarkings(markings);
  };

  // Load all the date entries in history into entries array upon initial load
  useEffect(() => {
    loadEntries();
    updateCalendarMarkings();
  }, [plant_id, JSON.stringify(history), JSON.stringify(water_history)]);

  // Listener for updating calendar markings *note this hook will run every time since we are creating a new Date object
  useEffect(() => {
    updateCalendarMarkings();
  }, [selectedDate, displayAddEntryModal]);

  useEffect(() => {
    if (editedEntry) {
      let history = parseEntries();
      dispatch(updateTaskHistory(history, plant_id));
      dispatch(setEditedEntry(false));
    }
  }, [editedEntry]);

  // Header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          tintColor={Colors.lightGreen900}
          onPress={() => {
            navigation.navigate('Home');
            dispatch(resetPlantState());
          }}
        />
      ),
      headerRight: () => (
        <IconButton
          icon="pencil"
          color={Colors.lightGreen900}
          onPress={() => navigation.navigate('EditPlantProfile')}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column'}}>
            <View style={styles.containerPicture}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: photo,
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.plantNameStyle}>
              {nickname
                ? nickname.length > 13
                  ? nickname.substring(0, 12) + '...'
                  : nickname
                : 'My Plant'}
            </Text>
            <Text style={styles.scientificZoneStyle}>
              {plant_name
                ? plant_name.length > 20
                  ? plant_name.substring(0, 19) + '...'
                  : plant_name
                : 'Scientific Plant Name'}
            </Text>
          </View>
        </View>

        <View style={{paddingTop: 10}}>
          <Text style={styles.NRTParentStyle}> Notes </Text>
          <Text style={styles.randomStyling}>{notes ? notes : 'No notes yet'}</Text>
        </View>

        <View>
          <Text style={styles.NRTParentStyle}>Scheduled Reminders</Text>
        </View>

        <View style={styles.smallerPhoneStyling}>
          <Text style={styles.NRTChildStyle}>Water</Text>
          <Text>
            {water_history && water_history.length > 0 ? water_history[0] : 'No Reminders'}
          </Text>
          <IconButton
            icon="pencil"
            style={styles.editButton}
            onPress={() => setDisplayWaterModal(true)}
          />
        </View>

        <View style={styles.smallerPhoneStyling}>
          <Text style={styles.NRTChildStyle}>Repot</Text>
          <Text>
            {repot_history && repot_history.length > 0 ? repot_history[0] : 'No Reminders'}
          </Text>
          <IconButton
            icon="pencil"
            style={styles.editButton}
            onPress={() => setDisplayRepotModal(true)}
          />
        </View>

        <View style={styles.smallerPhoneStyling}>
          <Text style={styles.NRTChildStyle}>Fertilize</Text>
          <Text style={styles.fertilizeText}>
            {fertilize_history && fertilize_history.length > 0
              ? fertilize_history[0]
              : 'No Reminders'}
          </Text>
          <IconButton
            icon="pencil"
            style={styles.editButton}
            onPress={() => setDisplayFertilizeModal(true)}
          />
        </View>

        <View style={{paddingTop: 10}}>
          <Text style={styles.NRTParentStyle}> Task History </Text>
          <ReactCalendar
            enableSwipeMonths={true}
            onDayPress={day => {
              setSelectedDate(day.dateString);
              if (entries[selectedDate] != null) {
                setWaterStatus(entries[selectedDate][0]);
                setRepotStatus(entries[selectedDate][1]);
                setFertilizeStatus(entries[selectedDate][2]);
              } else {
                setWaterStatus(false);
                setRepotStatus(false);
                setFertilizeStatus(false);
              }
              updateCalendarMarkings();
            }}
            markedDates={markings}
            maxDate={new Date()}
            markingType={'custom'}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: Colors.grey600,
              selectedDayTextColor: 'white',
              selectedDayBackgroundColor: Colors.lightGreen300,
              arrowColor: Colors.lightGreen300,
              todayTextColor: Colors.lightGreen300,
              dayTextColor: Colors.grey600,
              textDisabledColor: Colors.grey400,
            }}
          />
          <Button onPress={() => setDisplayAddEntryModal(true)}>Edit Entry</Button>
          <AddEntryModal
            selectedDate={selectedDate}
            displayModal={displayAddEntryModal}
            onPress={() => setDisplayAddEntryModal(false)}
            onExit={() => setDisplayAddEntryModal(false)}
            entries={entries}
            updateCalendarMarkings={() => updateCalendarMarkings}
          />
          <SetWaterReminderModal
            displayModal={displayWaterModal}
            onExit={() => setDisplayWaterModal(false)}
          />
          <SetRepotReminderModal
            displayModal={displayRepotModal}
            onExit={() => setDisplayRepotModal(false)}
          />
          <SetFertilizeReminderModal
            displayModal={displayFertilizeModal}
            onExit={() => setDisplayFertilizeModal(false)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
  },

  buttonStyle: {
    borderRadius: 1,
    fontSize: 18,
    textTransform: 'none',
    color: '#64A3A3',
    fontStyle: 'normal',
    fontWeight: 'normal',
  },

  columnStyle: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },

  containerPicture: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 10,
    height: windowHeight * 0.23,
    marginLeft: 20,
  },

  editButtonStyle: {
    alignItems: 'flex-end',
  },

  homeButtonStyle: {
    alignItems: 'flex-start',
  },

  profilePicture: {
    flexDirection: 'column',
    borderColor: 'black',
    width: 150,
    height: 150,
    borderRadius: 100,
  },

  NRTChildStyle: {
    alignSelf: 'center',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#666666',
    fontSize: 16,
    lineHeight: 30,
  },

  NRTParentStyle: {
    marginLeft: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#000',
    fontSize: 22,
    lineHeight: 30,
    justifyContent: 'space-around',
  },
  plantNameStyle: {
    alignContent: 'center',
    top: '30%',
    fontSize: 26,
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#000',
    paddingBottom: 3,
  },

  randomStyling: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#666666',
    fontSize: 16,
    lineHeight: 30,
    marginLeft: 40,
  },

  scientificZoneStyle: {
    alignContent: 'center',
    top: '30%',
    fontSize: 16,
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#666666',
    paddingBottom: 3,
  },

  smallerPhoneStyling: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    alignSelf: 'center',
   // borderWidth: 1, 
   // borderStyle: "solid",
    width: windowWidth * 0.78,
    height: windowHeight * 0.047,
  },
  textTitle: {
    fontSize: 24,
    color: '#000000',
    fontStyle: 'normal',
    fontWeight: 'normal',
    width: '50%',
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
  editButton: {
    alignSelf: "flex-start",
    right: windowWidth * 0.03,
    width: 35,
    height: 24,
    bottom: 5,
  },
  fertilizeText: {
    right: windowWidth * 0.02,
  }
});
