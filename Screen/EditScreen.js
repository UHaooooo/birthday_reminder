import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	DatePickerAndroid,
	TouchableOpacity,
	Alert
} from 'react-native';
import {
	MKButton,
	MKTextField
} from 'react-native-material-kit';
import {
	InputWithLabel
} from '../UI';

let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class EditScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit Birthday'
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      peopleId: this.props.navigation.getParam('id'),
      name: '',
      birthday: '',
    };

    this._query = this._query.bind(this);
    this._update = this._update.bind(this);

    this.db = SQLite.openDatabase({name: 'peoplesdb', createFromLocation : '~db.sqlite'}, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM peoples WHERE id = ?', [this.state.peopleId], (tx, results) => {
        if(results.rows.length) {
          this.setState({
            name: results.rows.item(0).name,
            birthday: results.rows.item(0).birthday,
          })
        }
      })
    });
  }

  _update() {
    if ((this.state.name != '') && (this.state.date != '')) {
        this.db.transaction((tx) => {
            tx.executeSql('UPDATE peoples SET name=?,birthday=? WHERE id=?', [
                this.state.name,
                this.state.birthday,
                this.state.peopleId
            ]);
        });
        Alert.alert("Record updated successfully!");
        this.props.navigation.getParam('refresh')();
        this.props.navigation.getParam('homeRefresh')();
        this.props.navigation.goBack();
	} else {
			Alert.alert("Please ensure all input are correct!");
	}
  }

  openDatePicker = async () => {
    try {
        const { action, year, month, day } = await DatePickerAndroid.open({
            date: new Date(this.state.release_date),
            mode: 'calendar',
        });
        if (action !== DatePickerAndroid.dismissedAction) {
            let selectedDate = new Date(year, month, day);
            let today = new Date();

            if (selectedDate <= today) {
                this.setState({
                    date: selectedDate.toISOString().split('T')[0],
                    birthday: selectedDate.formatted(),
                });
            } else {
                Alert.alert("Please pick a valid date!");
            }
        }
    } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
    }
}

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  render() {
    let people = this.state.people;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity>
                <InputWithLabel
                    textInputStyle={{ color: '#000000' }}
                    label={'Name'}
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    orientation={'horizontal'}
                    placeholder={'Enter name'}
                    tintColor={"#FF6600"}
                    highlightColor={"#99CC33"}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openDatePicker}>
                <InputWithLabel
                    textInputStyle={{ color: '#000000' }}
                    label={'Birthday'}
                    value={this.state.birthday}
                    orientation={'horizontal'}
                    placeholder={'Pick date'}
                    tintColor={"#FF6600"}
                    highlightColor={"#99CC33"}
                    editable={false}
                />
            </TouchableOpacity>
            <MKButton
                backgroundColor={"#99CC33"}
                shadowRadius={2}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={.7}
                shadowColor="black"
                style={{ padding: 20 }}
                onPress={this._update}
            >
                <Text pointerEvents="none"
                    style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    SAVE
                </Text>
            </MKButton>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});