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

Date.prototype.formatted = function () {
	let day = this.getDay();
	let date = this.getDate();
	let month = this.getMonth();
	let year = this.getFullYear();
	let daysText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	let monthsText = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	];

	return `${date} ${monthsText[month]} ${year}`;
}

export default class PeopleScreen extends Component<Props> {
	static navigationOptions = {
		title: 'Save New Birthday',
	};

	constructor(props) {
		super(props);

		this.state = {
			name: '',
			date: '',
			date_display: '',
		}

		this._insert = this._insert.bind(this);

		this.db = SQLite.openDatabase({
			name: 'peoplesdb',
			createFromLocation: '~db.sqlite',
		}, this.openDb, this.errorDb);
	}

	openDb() {
		console.log('Database opened');
	}

	errorDb(err) {
		console.log('SQL Error: ' + err);
	}

	_insert() {
		if ((this.state.name != '') && (this.state.date != '')) {
			this.db.transaction((tx) => {
				tx.executeSql('INSERT INTO peoples(name,birthday) VALUES(?,?)', [
					this.state.name,
					this.state.date,
				]);
			});

			this.props.navigation.getParam('refresh')();
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
						date_display: selectedDate.formatted(),
					});
				} else {
					Alert.alert("Please pick a valid date!");
				}
			}
		} catch ({ code, message }) {
			console.warn('Cannot open date picker', message);
		}
	}

	render() {
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
						value={this.state.date_display}
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
					onPress={this._insert}
				>
					<Text pointerEvents="none"
						style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
						ADD
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
	},
});