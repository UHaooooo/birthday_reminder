import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableHighlight,
	TouchableNativeFeedback,
	FlatList,
	Alert,
	Image
} from 'react-native';
import {
	Avatar,
	Card,
	ListItem,
	SearchBar
} from 'react-native-elements';
import {
	getTheme,
	MKButton,
	MKColor
} from 'react-native-material-kit';
import { FloatingAction } from 'react-native-floating-action';

let SQLite = require('react-native-sqlite-storage');

const actions = [{
	text: 'Create',
	icon: require('../images/baseline_add_white_18dp.png'),
	name: 'create',
	position: 1
}];

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

Date.prototype.getAge = function getAge() {
	var today = new Date();
	var age = today.getFullYear() - this.getFullYear();
	var m = today.getMonth() - this.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < this.getDate())) {
		age--;
	}
	return age;
}

export default class AllScreen extends Component<Props> {

	static navigationOptions = {
		title:'All',
	};

	constructor(props) {
		super(props);

		this.state = {
			searchClearIcon:false,
			birthdayList: [],
			searchText:'',
		}

		this._query = this._query.bind(this);

		this.db = SQLite.openDatabase({
			name: 'peoplesdb',
			createFromLocation: '~db.sqlite',
		}, this.openDb, this.errorDb);
	}
	
	_onChangeSearchText = (searchText) => {
		if(searchText){
			this.setState({
				searchClearIcon: true,
				searchText: searchText,
			});
		}else{
			this.setState({
				searchClearIcon:false,
				searchText: '',
			});
    	}
	}

	componentDidMount() {
		this._query();
	}

	componentDidUpdate() {
		this._query();
  	}

	_query() {
		var searchQuery = "%" + this.state.searchText + "%";
		this.db.transaction((tx) => {
			tx.executeSql('SELECT * FROM peoples WHERE name LIKE ?', [searchQuery], (tx, results) => {
				var people = [];
				var tempBirthdayList = [];
				var birthdays = [
					{
						month: 'January',
						people: [],
					},
					{
						month: 'February',
						people: [],
					},
					{
						month: 'March',
						people: [],
					},
					{
						month: 'April',
						people: [],
					},
					{
						month: 'May',
						people: [],
					},
					{
						month: 'June',
						people: [],
					},
					{
						month: 'July',
						people: [],
					},
					{
						month: 'August',
						people: [],
					},
					{
						month: 'September',
						people: [],
					},
					{
						month: 'October',
						people: [],
					},
					{
						month: 'November',
						people: [],
					},
					{
						month: 'December',
						people: [],
					},
				];

				people = results.rows.raw();

				for (var i = 0; i < people.length; i++) {
					var month = (new Date(people[i].birthday)).getMonth();

					birthdays[month].people.push({
						id: people[i].id,
						name: people[i].name,
						birthday: (new Date(people[i].birthday)).formatted(),
						age: ((new Date(people[i].birthday)).getAge()).toString()
					});
				}

				for (var j = 0; j < birthdays.length; j++) {
					if (birthdays[j].people.length > 0) {
						tempBirthdayList.push({
							month: birthdays[j].month,
							people: birthdays[j].people,
						});
					}
				}

				this.setState({
					birthdayList: tempBirthdayList
				})
			})
		});
	}

	openDb() {
		console.log('Database opened');
	}

	errorDb(err) {
		console.log('SQL Error: ' + err);
	}

	render() {
		return (
			<View style={styles.container}>
				<SearchBar
					round
					containerStyle={{backgroundColor: '#FF6600'}} 
					inputStyle={{backgroundColor: '#fffff0'}} 
					icon={{color:'gray'}}
					placeholder='Search'
					lightTheme
					placeholderTextColor='gray'
					clearIcon={this.state.searchClearIcon}
					onChangeText={this._onChangeSearchText}
					//onClearText={someMethod}
					placeholder='Search name...' 
				/>
				<FlatList
					style={styles.sectionList}
					data={this.state.birthdayList}
					showsVerticalScrollIndicator={true}
					renderItem={({ item }) =>
						<Card
							title={item.month}
							containerStyle={{ margin: 0 }}
							titleStyle={{ textAlign: 'left', marginLeft: 55 }}
						>
							{
								item.people.map((u, i) => {
									return (
										<TouchableNativeFeedback key={u.id}>
											<ListItem
												key={u.id}
												roundAvatar
												avatar={<Avatar size="small" rounded title={u.age} />}
												title={u.name}
												subtitle={u.birthday}
												containerStyle={{ borderBottomWidth: 0 }}
												onPress={
													() => {
														this.props.navigation.navigate('People',{
															id: u.id,
															headerTitle: u.name,
															refresh: this._query,
														})
													}
												}
											/>
										</TouchableNativeFeedback>
									);
								})
							}
						</Card>
					}
					keyExtractor={(item, index) => { index }}
				/>
				<FloatingAction
					actions={actions}
					overrideWithAction={true}
					color={'#99CC33'}
					onPressItem={
						() => {
							this.props.navigation.navigate('Create', {
								refresh: this._query,
							})
						}
					}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	sectionList: {
		flex: 1
	},
});