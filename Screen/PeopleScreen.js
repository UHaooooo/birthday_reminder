import React, { Component } from 'react';
import {
	Alert,
	StyleSheet,
	Button,
	Text,
	View,
	TextInput,
	ScrollView,
	Image,
	TouchableNativeFeedback
} from 'react-native';
import {
	Icon,
	Card,
	ListItem,
	Avatar
} from 'react-native-elements';
import {
	InputWithLabel
} from '../UI';
import {FloatingAction} from 'react-native-floating-action';

const actions = [{
	text: 'Edit',
	color: '#c80000',
	icon: require('../images/baseline_edit_white_18dp.png'),
	name:'edit',
	position:2
},{
	text:'Delete',
	color:'#c80000',
	icon: require('../images/baseline_delete_white_18dp.png'),
	name: 'delete',
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

Date.prototype.getZodiac = function getZodiac(){
	var zod_signs = ["Capricorn" , "Aquarius", "Pisces", "Aries",
	"Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio",
	"Sagittarius"];
	var day = this.getDate();
	var month = this.getMonth();
	var zodiacSign = "";
	switch(month)
	{
		case 0: {//January
					if(day < 20){
						zodiacSign = zod_signs[0];
					}
					else{
						zodiacSign = zod_signs[1];
					}
				}break;
		case 1: {//February
					if(day < 19){
						zodiacSign = zod_signs[1];
					}
					else{
						zodiacSign = zod_signs[2];
					}
				}break;
		case 2: {//March
					if(day < 21){
						zodiacSign = zod_signs[2];
					}
					else{
						zodiacSign = zod_signs[3];
					}
				}break;
		case 3: {//April
					if(day < 20){
						zodiacSign = zod_signs[3];
					}
					else{
						zodiacSign = zod_signs[4];
					}
				}break;
		case 4: {//May
					if(day < 21){
						zodiacSign = zod_signs[4];
					}
					else{
						zodiacSign = zod_signs[5];
					}
				}break;
		case 5: {//June
					if(day < 21){
						zodiacSign = zod_signs[5];
					}
					else{
						zodiacSign = zod_signs[6];
					}
				}break;
		case 6: {//July
					if(day < 23){
						zodiacSign = zod_signs[6];
					}
					else{
						zodiacSign = zod_signs[7];
					}
				}break;
		case 7: {//August
					if(day < 23){
						zodiacSign = zod_signs[7];
					}
					else{
						zodiacSign = zod_signs[8];
					}
				}break;
		case 8: {//September
					if(day < 23){
						zodiacSign = zod_signs[8];
					}
					else{
						zodiacSign = zod_signs[9];
					}
				}break;
		case 9: {//October
					if(day < 23){
						zodiacSign = zod_signs[9];
					}
					else{
						zodiacSign = zod_signs[10];
					}
				}break;
		case 10: {//November
					if(day < 22){
						zodiacSign = zod_signs[10];
					}
					else{
						zodiacSign = zod_signs[11];
					}
				}break;
		case 11: {//December
					if(day < 22){
						zodiacSign = zod_signs[11];
					}
					else{
						zodiacSign = zod_signs[0];
					}
				}break;
	}
	return zodiacSign;
}

Date.prototype.getDayLeft = function getDayLeft(){
	var today = new Date();
	var birthday = new Date(today.getFullYear(), this.getMonth(), this.getDate());

	if(today>birthday){
		birthday = new Date(today.getFullYear()+1,this.getMonth(),this.getDate());
	}

	var day = (birthday - today)/(1000*60*60*24);

	return (Math.floor(day)).toString();
}

let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class ViewScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('headerTitle')
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      peopleId: this.props.navigation.getParam('id'),
	  people: null,
	  zodiacSign: "",
	  dayLeft: null,
	  imageSourceOption:'',
    };

    this._query = this._query.bind(this);

    this.db = SQLite.openDatabase({name: 'peoplesdb', createFromLocation : '~db.sqlite'}, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM peoples WHERE id = ?', [this.state.peopleId], (tx, results) => {
        if(results.rows.length) {
			var tpeople = results.rows.item(0);
			tpeople.birthday = (new Date(tpeople.birthday)).formatted()
			var zodiacSignmou = (new Date(tpeople.birthday)).getZodiac();
			var dayLeft = (new Date(tpeople.birthday)).getDayLeft();

			if(zodiacSignmou =="Virgo"){
				this.setState({
					imageSourceOption: require('../images/Virgo.png')
				});
			}
			switch(zodiacSignmou){
				case "Capricorn":
					this.setState({
						imageSourceOption: require('../images/Capricorn.png')
					});
					break;
				case "Aquarius":
					this.setState({
						imageSourceOption: require('../images/Aquarius.png')
					});
					break;
				case "Pisces":
					this.setState({
						imageSourceOption: require('../images/Pisces.png')
					});
					break;
				case "Aries":
					this.setState({
						imageSourceOption: require('../images/Aries.png')
					});
					break;
				case "Taurus":
					this.setState({
						imageSourceOption: require('../images/Taurus.png')
					});
					break;
				case "Gemini":
					this.setState({
						imageSourceOption: require('../images/Gemini.png')
					});
					break;
				case "Cancer":
					this.setState({
						imageSourceOption: require('../images/Cancer.png')
					});
					break;
				case "Leo":
					this.setState({
						imageSourceOption: require('../images/Leo.png')
					});
					break;
				case "Virgo":
					this.setState({
						imageSourceOption: require('../images/Virgo.png')
					});
					break;
				case "Libra":
					this.setState({
						imageSourceOption: require('../images/Libra.png')
					});
					break;
				case "Scorpio":
					this.setState({
						imageSourceOption: require('../images/Scorpio.png')
					});
					break;
				case "Sagittarius":
					this.setState({
						imageSourceOption: require('../images/Sagittarius.png')
					});
					break;
			}

			this.setState({
				people: tpeople,
				zodiacSign: zodiacSignmou,
				dayLeft: dayLeft,
			})
        }
      })
    });
  }

  _delete() {
    Alert.alert('Confirm Deletion', 'Delete `'+ this.state.people.name +'`?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          this.db.transaction((tx) => {
            tx.executeSql('DELETE FROM peoples WHERE id = ?', [this.state.peopleId])
          });

          this.props.navigation.getParam('refresh')();
          this.props.navigation.goBack();
        },
      },
    ], { cancelable: false });
  }

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  render() {
	let people = this.state.people;
	let zodiacSign = this.state.zodiacSign;
	let dayLeft = this.state.dayLeft + ' Days';
	let imageSourceOption = this.state.imageSourceOption;
    return (
		<View style={styles.container}>
			<ScrollView>
				<Card>
					<Card
						containerStyle={{ margin: 0 }}
						titleStyle={{ textAlign: 'left', marginLeft: 55 }}>
								<ListItem
									avatar={<Icon
											color='skyblue'
											name='date-range'
											size={40}
									/>}
									hideChevron
									title={people ? people.birthday: ''}
									subtitle={'Birthday'}
									containerStyle={{ borderBottomWidth: 0 }}
								/>
					</Card>
					<Card
						containerStyle={{ margin: 0 }}
						titleStyle={{ textAlign: 'left', marginLeft: 55 }}>
								<ListItem
									avatar={<Icon
											color='red'
											name='timer'
											size={40}
									/>}
									hideChevron
									title={dayLeft ? dayLeft:''}
									subtitle={'Day until next birthday'}
									containerStyle={{ borderBottomWidth: 0 }}
								/>
					</Card>
					<Card
						containerStyle={{ margin: 0 }}
						titleStyle={{ textAlign: 'left', marginLeft: 55 }}>
								<ListItem
									avatar={<Image
											source={imageSourceOption ? imageSourceOption: ''}
											style={{height:40, width:40}}
									/>}
									hideChevron
									title={zodiacSign ? zodiacSign: ''}
									subtitle={'Zodiac Sign'}
									containerStyle={{ borderBottomWidth: 0 }}
								/>
					</Card>
				</Card>
			</ScrollView>
			<FloatingAction
				actions={actions}
				color='#FF0099'
				floatingIcon={(
					<Icon
						name='menu'
					/>
				)}
				onPressItem={
					(name)=>{
						switch(name){
						case 'edit':
							this.props.navigation.navigate('Edit', {
								id: people ? people.id : 0,
								peopleName: people ? people.name :'',
								peopleBirthday: people ? people.birthday:'',
								headerTitle: people ? people.name : '',
								refresh: this._query,
								homeRefresh: this.props.navigation.getParam('refresh'),
							});
							break;
						case 'delete':
							this._delete();
							break;
						}
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
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		margin: 20,
	},
	button: {
		margin: 10,
	},
	output: {
		fontSize: 24,
		color: '#000099',
		marginTop: 10,
		marginBottom: 10,
	},
});