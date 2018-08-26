import React, { Component } from 'react';
import {
	StyleSheet,
	Button,
	Text,
	View,
	SectionList,
} from 'react-native';
import {
	CalendarList,
	Agenda
} from 'react-native-calendars';

export default class CalendarScreen extends Component<Props> {
	/**
	 * A screen component can set navigation options such as the title.
	 */
	static navigationOptions = {
		title: 'CALENDAR',
	};

	render() {
		return (
			// Try setting `justifyContent` to `center`.
			// Try setting `flexDirection` to `row`.
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
					markedDates={{
						'2018-08-16': {selected: true, marked: true, selectedColor: 'orange'},
						//'2018-08-17': {marked: true},
						//'2018-08-18': {marked: true, dotColor: 'red', activeOpacity: 0},
						//'2018-08-19': {disabled: true, disableTouchEvent: true}
					}}
					/>
					{/* <View style={{
						flex: 1
					}}>
						<View style={{ flex: 1, backgroundColor: 'powderblue' }} />
						<View style={{ flex: 1, backgroundColor: 'skyblue' }} />
						<View style={{ flex: 1, backgroundColor: 'steelblue' }} />
					</View> */}
			</View>
		);
	}
};