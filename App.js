
import React, { Component } from 'react';
import {
	createStackNavigator,
	createBottomTabNavigator
} from 'react-navigation';
import{
	View,
	Text,
	TouchableNativeFeedback
} from 'react-native';
import{
	Icon
} from 'react-native-elements';
import HomeScreen from './Screen/HomeScreen';
import PeopleScreen from './Screen/PeopleScreen';
import SettingScreen from './Screen/SettingScreen';
import MonthScreen from './Screen/MonthScreen';
import AllScreen from './Screen/AllScreen';
import CalendarScreen from './Screen/CalendarScreen';
import CreateScreen from './Screen/CreateScreen';

let TabNavigator = createBottomTabNavigator({
	Month: {
		screen: MonthScreen,
	},
	All: {
		screen: AllScreen,
	},
	Calendar: {
		screen: CalendarScreen
	}
}, {
		initialRouteName: 'All',
		tabBarOptions: {
			activeTintColor: '#FFFFFF',
			inactiveTintColor: '#000000',
			activeBackgroundColor: '#FF6600',
			labelStyle: {
				fontSize: 20,
			},
			tabStyle: {
				padding: 10,
			}
		}
	});

let StackNavigator = createStackNavigator({
	Home: {
		screen: TabNavigator,
		/*navigationOptions:{
			headerTitle: 'Birthday Reminder',
		}*/
		navigationOptions: ({ navigation }) => ({
			headerTitle: 'Birthday Mou',
			headerRight: 
				<View style={{paddingRight:15}}>
					<Icon
						name='settings'
						size={32}
						color= '#ffffff'
						underlayColor='#FF6600'
						onPress={
							()=> {
								navigation.navigate('Setting',{
									//refresh:this._query,
								})
							}
						}
					/>
				</View>
		})
	},
	Setting: {
		screen: SettingScreen
	},
	People: {
		screen: PeopleScreen
	},
	Create: {
		screen: CreateScreen
	},
}, {
		initialRouteName: 'Home',
		navigationOptions: {
			headerStyle: {
				backgroundColor: '#FF6600',
			},
			headerTintColor: '#fff',
			headerTitleStyle: {
				fontWeight: 'bold',
			},
		},
	});

type Props = {};

export default class App extends Component<Props> {
	render() {
		return (
				<StackNavigator />
		);
	}
}