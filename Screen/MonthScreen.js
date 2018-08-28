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
import { FloatingAction } from 'react-native-floating-action';

let SQLite = require('react-native-sqlite-storage');

export default class MonthScreen extends Component<Props> {


  constructor(props){
    super(props)

    this.state = {
      searchClearIcon:false,
      peoples:[]
    }

    this._query = this._query.bind(this);

    this.db = SQLite.openDatabase({name:'peoplesdb', createFromLocation:'~db.sqlite'},this.openDb, this.errorDb);
  }
  _onChangeSearchText = (searchText) => {
		if(searchText){
			this.setState({searchClearIcon: true})
		}else{
			this.setState({searchClearIcon:false})
		}
	}

  componentDidMount() {
		this._query();
  }
  
  _query(){
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM peoples',[],
      (tx,results)=> {
        tx.executeSql('SELECT * FROM peoples', [], (tx, results) => {
          var people = [];
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
          today= new Date();
          todayMonth = today.getMonth();

          for (var i = 0; i < people.length; i++) {
            var peopleMonth = (new Date(people[i].birthday)).getMonth();
  
            if(peopleMonth == todayMonth){
              birthdays[peopleMonth].people.push({
                id: people[i].id,
                name: people[i].name,
                birthday: (new Date(people[i].birthday)).formatted(),
                age: ((new Date(people[i].birthday)).getAge()).toString()
              });
            }
          }

          var tempBirthdayList =[];
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
          });
      })
      })
    })
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
					placeholder='Search...' 
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