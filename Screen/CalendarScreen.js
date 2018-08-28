import React, { Component } from 'react';
import {
	StyleSheet,
	Button,
	Text,
	View,
	SectionList,
	Alert
} from 'react-native';
import {
	CalendarList,
	Agenda
} from 'react-native-calendars';

let SQLite = require('react-native-sqlite-storage');


Array.prototype.setMarkedDateObj = function setMarkedDateObj(){
	var obj = this.reduce((c, v) => Object.assign(c, {[v]: {selected: true, marked: true, selectedColor: 'orange'}}), {});
	return obj;
}

export default class CalendarScreen extends Component<Props> {
	/**
	 * A screen component can set navigation options such as the title.
	 */
	// static navigationOptions = {
	// 	title: 'CALENDAR',
	// };

	constructor(props){
		super(props);

		this.state = {
			marked : false,
			people: [],
			birthday_date: []
		}

		this._query = this._query.bind(this);

		this.db = SQLite.openDatabase({name: 'peoplesdb', createFromLocation:'~db.sqlite'},
		 this.openDb, this.errorDb);
	}

	componentDidMount() {
		this._query();
	}

	componentDidUpdate() {
		this._query();
	}

	_query(){
		this.db.transaction((tx) =>{
			tx.executeSql('SELECT * FROM peoples', [],
			 (tx,results) =>{
				 if(results.rows.length){
					var people = results.rows.raw();
					var birthdayDate = [];
					var today = new Date();
					var currYear = today.getFullYear();

					for(var i=0; i< people.length;i++){
						var month = people[i].birthday.split("-")[1]
						var day = people[i].birthday.split("-")[2];
						var birthday = currYear+"-"+month+"-"+day;
						birthdayDate.push(birthday);
						people[i].birthday = birthday;
					}

					

					var obj = birthdayDate.reduce((c, v) => Object.assign(c, {[v]: {selected: true, marked: true, selectedColor: 'orange'}}), {});
					this.setState({ 
						marked : obj,
						people: people
					});
				 }
			 });
		})
	}

	_anotherFunc(){
		Alert.alert(this.state.birthday_date[0]);
		var obj = this.state.birthday_date.reduce((c, v) => Object.assign(c, {[v]: {selected: true, marked: true, selectedColor: 'orange'}}), {});
		this.setState({ marked : obj});
	}

	openDb() {
		console.log('Database opened');
	}

	errorDb(err) {
		console.log('SQL Error: ' + err);
	}

	render() {

	let marked = this.state.marked;
	let people = this.state.people;
	
		return (
			<View style={{
				flex: 1,
				justifyContent: 'flex-start',
			}}>
				<CalendarList
				// Enable horizontal scrolling, default = false
					horizontal={true}
					// Enable paging on horizontal, default = false
					pagingEnabled={true}
					// Specify style for calendar container element. Default = {}
					// Specify theme properties to override specific styles for calendar parts. Default = {}
					theme={{
						backgroundColor: '#ffffff',
						calendarBackground: '#ffffff',
						textSectionTitleColor: '#b6c1cd',
						selectedDayBackgroundColor: '#00adf5',
						selectedDayTextColor: '#ffffff',
						todayTextColor: '#00adf5',
						dayTextColor: '#000000',
						textDisabledColor: '#d9e1e8',
						dotColor: '#00adf5',
						selectedDotColor: '#ffffff',
						textDayFontFamily: 'monospace',
						textMonthFontFamily: 'monospace',
						textDayHeaderFontFamily: 'monospace',
						textMonthFontWeight: 'bold',
						textDayFontSize: 16,
						textDayHeaderFontSize: 16,
						'stylesheet.calendar.header': {
							header:{
								paddingLeft:0,
								paddingRight:0
							},
							monthText: {
								margin: 10,
								color: '#000000',
								fontSize:25,
								fontWeight: 'bold'
							},
							dayText:{
								color:'red'
							}
						},
						'stylesheet.day.basic':{
							base: {
								width: 32,
								height: 32,
								alignItems: 'center'
							},
							text: {
								fontWeight: 'bold',
								color: 'black',
							},
						},
						'stylesheet.calendar.main':{
							week: {
								marginTop: 10,
								marginBottom:40,
								flexDirection: 'row',
								justifyContent: 'space-around'
							  },
							  container: {
								paddingLeft: 5,
								paddingRight: 5,
							  },
						}
					}}
					// Collection of dates that have to be marked. Default = {}
					markedDates={marked ? marked : Object}
						//'2018-08-17': {selected: true, marked: true, selectedColor: 'orange'},
						//'2018-08-17': {marked: true},
						//'2018-08-18': {marked: true, dotColor: 'red', activeOpacity: 0},
						//'2018-08-19': {disabled: true, disableTouchEvent: true}
					//}
					onDayPress={
						(day) => {
							var allPeople ='';
							var x = 1;
							for(var i=0;i<people.length;i++){
								if(day.dateString == people[i].birthday){
									allPeople+= x + ") " + people[i].name + '\n';
									x++;
								}
							}
							if(allPeople != ''){
								Alert.alert("Whose gonna birthday?!\n", allPeople);
							}
						}
					}
					/>
			</View>
		);
	}
};