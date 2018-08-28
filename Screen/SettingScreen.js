import React, { Component } from 'react';
import {
	StyleSheet,
	FlatList,
	View,
	TouchableNativeFeedback,
	Alert,
	Clipboard,
	ToastAndroid
} from 'react-native';
import {
	Card,
	ListItem,
	Text,
	Button,
	FormValidationMessage
} from 'react-native-elements';
import Modal from 'react-native-modal';
import {
	MKButton,
	MKTextField
} from 'react-native-material-kit';

let SQLite = require('react-native-sqlite-storage');

let serverPath = 'http://10.0.2.2:5000';

export default class SettingScreen extends Component<Props> {
	static navigationOptions = {
		title: 'Setting Mou',
	};

	constructor(props) {
		super(props);

		this.state = {
			settingOptions: [],
			backupCode: '',
			isScreenshotModalVisible: false,
			isBackupModalVisible: false,
			isRestoreModalVisible: false,
			errorMessage: '',
			people: [],
		};

		this._insert = this._insert.bind(this);
		this._firstTimeBackup = this._firstTimeBackup.bind(this);
		this._backup = this._backup.bind(this);
		this._restore = this._restore.bind(this);
		this._toggleBackupModal = this._toggleBackupModal.bind(this);
		this._toggleRestoreModal = this._toggleRestoreModal.bind(this);
		this._toggleScreenshotModal = this._toggleScreenshotModal.bind(this);

		this.db = SQLite.openDatabase({
			name: 'peoplesdb',
			createFromLocation: '~db.sqlite',
		}, this.openDb, this.errorDb);
	}

	componentDidMount() {
		var settingOptionList = [
			{
				section: 'Backup',
				option: [
					{
						id: '1',
						name: 'First Time Backup',
						onPress: this._firstTimeBackup
					},
					{
						id: '2',
						name: 'Backup Using Backup Code',
						onPress: this._toggleBackupModal
					}
				],
			},
			{
				section: 'Restore',
				option: [
					{
						id: '3',
						name: 'Restore using Backup Code',
						onPress: this._toggleRestoreModal
					}
				],
			},
		];

		this.setState({
			settingOptions: settingOptionList,
		})
	}

	_toggleBackupModal() {
		this.setState(prevState => ({
			isBackupModalVisible: !prevState.isBackupModalVisible
		}));
	}

	_toggleRestoreModal() {
		this.setState(prevState => ({
			isRestoreModalVisible: !prevState.isRestoreModalVisible
		}));
	}

	_toggleScreenshotModal() {
		this.setState(prevState => ({
			isScreenshotModalVisible: !prevState.isScreenshotModalVisible
		}));
	}

	_insert(count) {
		this.db.transaction((tx) => {
			tx.executeSql('INSERT INTO peoples(name,birthday) VALUES(?,?)', [
				this.state.people[count].name,
				this.state.people[count].birthday,
			])
		});
	}

	_firstTimeBackup() {
		this.setState({
			backupCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
		})

		Alert.alert('Your local data will be backup to cloud.', 'Cloud data will be replaced by local data. Are you sure?', [
			{
				text: 'Yes',
				onPress: () => {
					var user_id_fk;

					fetch(serverPath + '/api/addUser', {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							backupCode: this.state.backupCode
						}),
					})
						.then((response) => {
							if (!response.ok) {
								Alert.alert('Error', response.status.toString());
								throw Error('Error ' + response.status);
							}

							return response.json()
						})
						.then((responseJson) => {
							if (responseJson.affected > 0) {
								user_id_fk = responseJson.id;

								fetch(serverPath + '/api/delete-all-birthday-record/' + user_id_fk, {
									method: 'DELETE',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										user_id_fk: user_id_fk,
									}),
								})
									.then((response) => {
										if (!response.ok) {
											Alert.alert('Error', response.status.toString());
											throw Error('Error ' + response.status);
										}
									})
									.then((responseJson) => {
										this.db.transaction((tx) => {
											tx.executeSql('SELECT * FROM peoples ORDER BY name ASC', [], (tx, results) => {
												let people = [];
												people = results.rows.raw();
												var count = 0;

												function save() {
													fetch(serverPath + '/api/add-birthday-record', {
														method: 'POST',
														headers: {
															Accept: 'application/json',
															'Content-Type': 'application/json',
														},
														body: JSON.stringify({
															name: people[count].name,
															birthday: people[count].birthday,
															user_id_fk: user_id_fk
														}),
													})
														.then((response) => {
															if (!response.ok) {
																Alert.alert('Error', response.status.toString());
																throw Error('Error ' + response.status);
															} else {
																count++;

																if (count < people.length) {
																	save();
																}
															}
														})
														.catch((error) => {
															console.log(error);
														});
												}

												save();

												this._toggleScreenshotModal();
											})
										});
									})
									.catch((error) => {
										console.error(error);
									});
							}
							else {
								Alert.alert('Error backing up data', 'No data backed up');
							}
						})
						.catch((error) => {
							console.log(error);
						});
				},
			},
			{
				text: 'No',
				onPress: () => { },
			},
		], { cancelable: false });
	}

	_backup() {
		Alert.alert('Your local data will be backup to cloud.', 'Cloud data will be replaced by local data. Are you sure?', [
			{
				text: 'Yes',
				onPress: () => {
					var user_id_fk;

					fetch(serverPath + '/api/user/' + this.state.backupCode)
						.then((response) => {
							if (!response.ok) {
								Alert.alert('Error', response.status.toString());
								throw Error('Error ' + response.status);
							}

							return response.json()
						})
						.then((responseJson) => {
							if (responseJson.id == '') {
								Alert.alert("Backup Code not found!");
							} else {
								user_id_fk = responseJson.id;

								fetch(serverPath + '/api/delete-all-birthday-record/' + user_id_fk, {
									method: 'DELETE',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										user_id_fk: user_id_fk,
									}),
								})
									.then((response) => {
										if (!response.ok) {
											Alert.alert('Error', response.status.toString());
											throw Error('Error ' + response.status);
										}
									})
									.then((responseJson) => {
										this.db.transaction((tx) => {
											tx.executeSql('SELECT * FROM peoples ORDER BY name ASC', [], (tx, results) => {
												let people = [];
												people = results.rows.raw();
												var count = 0;

												function save() {
													fetch(serverPath + '/api/add-birthday-record', {
														method: 'POST',
														headers: {
															Accept: 'application/json',
															'Content-Type': 'application/json',
														},
														body: JSON.stringify({
															name: people[count].name,
															birthday: people[count].birthday,
															user_id_fk: user_id_fk
														}),
													})
														.then((response) => {
															if (!response.ok) {
																Alert.alert('Error', response.status.toString());
																throw Error('Error ' + response.status);
															} else {
																count++;

																if (count < people.length) {
																	save();
																}
															}
														})
														.catch((error) => {
															console.log(error);
														});
												}

												save();

												Alert.alert("Backup Success");

												this._toggleBackupModal();
												this.setState({
													backupCode: ''
												});
											})
										});
									})
									.catch((error) => {
										console.error(error);
									});
							}
						})
						.catch((error) => {
							console.log(error);
						});
				},
			},
			{
				text: 'No',
				onPress: () => { },
			},
		], { cancelable: false });
	}

	_restore() {
		Alert.alert('Local data will be wiped and replaced by data from cloud.', 'Are you sure?', [
			{
				text: 'Yes',
				onPress: () => {
					var user_id_fk;

					fetch(serverPath + '/api/user/' + this.state.backupCode)
						.then((response) => {
							if (!response.ok) {
								Alert.alert('Error', response.status.toString());
								throw Error('Error ' + response.status);
							}

							return response.json()
						})
						.then((responseJson) => {
							if (responseJson.id == '') {
								Alert.alert("Backup Code not found!");
							} else {
								user_id_fk = responseJson.id;

								this.db.transaction((tx) => {
									tx.executeSql('DELETE FROM peoples')
								}, [], () => {
									fetch(serverPath + '/api/select-all-birthday-record/' + user_id_fk)
										.then((response) => {
											if (!response.ok) {
												Alert.alert('Error', response.status.toString());
												throw Error('Error ' + response.status);
											}

											return response.json()
										})
										.then((birthday_record) => {
											this.setState({
												people: birthday_record
											});

											this.db.transaction((tx) => {
												for (var i = 0; i < this.state.people.length; i++) {
													tx.executeSql('INSERT INTO peoples(name,birthday) VALUES(?,?)', [
														this.state.people[i].name,
														this.state.people[i].birthday
													]);
												}
											});

											Alert.alert("Restore Success");
										})
										.catch((error) => {
											console.log(error);
										});
								});

								this._toggleRestoreModal();
								this.setState({
									backupCode: ''
								});
							}
						})
						.catch((error) => {
							console.log(error);
						});

				},
			},
			{
				text: 'No',
				onPress: () => { },
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
		return (
			<View style={styles.container}>
				<Modal
					isVisible={this.state.isBackupModalVisible}
					style={{ flex: 1 }}
					onBackdropPress={this._toggleBackupModal}
				>
					<Card style={{ flex: 1 }}>
						<Text style={{ textAlign: 'center', fontSize: 20 }}>Enter Backup Code to backup</Text>
						<MKTextField
							tintColor={'#000000'}
							highlightColor={"#99CC33"}
							value={this.state.backupCode}
							textInputStyle={{ color: '#000000' }}
							onChangeText={(backupCode) => this.setState({ backupCode })}
							style={{ marginLeft: 20, marginRight: 20 }}
							selectTextOnFocus={true}
						/>
						<FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
						<Button
							title='BACKUP'
							backgroundColor='#99CC33'
							onPress={() => {
								if (this.state.backupCode != '' && this.state.backupCode != null) {
									this.setState({
										errorMessage: ''
									})
									this._backup();
								} else {
									this.setState({
										errorMessage: 'Please enter backup code!'
									})
								}
							}}
						/>
					</Card>
				</Modal>
				<Modal
					isVisible={this.state.isRestoreModalVisible}
					style={{ flex: 1 }}
					onBackdropPress={this._toggleRestoreModal}
				>
					<Card style={{ flex: 1 }}>
						<Text style={{ textAlign: 'center', fontSize: 20 }}>Enter Backup Code to restore</Text>
						<MKTextField
							tintColor={'#000000'}
							highlightColor={"#99CC33"}
							value={this.state.backupCode}
							textInputStyle={{ color: '#000000' }}
							onChangeText={(backupCode) => this.setState({ backupCode })}
							style={{ marginLeft: 20, marginRight: 20 }}
							selectTextOnFocus={true}
						/>
						<FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
						<Button
							title='RESTORE'
							backgroundColor='#99CC33'
							onPress={() => {
								if (this.state.backupCode != '' && this.state.backupCode != null) {
									this.setState({
										errorMessage: ''
									})
									this._restore();
								} else {
									this.setState({
										errorMessage: 'Please enter backup code!'
									})
								}
							}}
						/>
					</Card>
				</Modal>
				<Modal
					isVisible={this.state.isScreenshotModalVisible}
					style={{ flex: 1 }}
					onBackdropPress={() => {
						this._toggleScreenshotModal();
						this.setState({
							backupCode: ''
						});
					}}
				>
					<Card style={{ flex: 1 }}>
						<Text style={{ textAlign: 'center', fontSize: 20 }}>Copy or Screenshot Backup Bode</Text>
						<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginTop: 20 }}>Backup Code:</Text>
						<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 20 }}>{this.state.backupCode}</Text>
						<FormValidationMessage>Backup code is required every time for backup and restore</FormValidationMessage>
						<Button
							title='COPY TO CLIPBOARD'
							backgroundColor='#99CC33'
							buttonStyle={{ margin: 20 }}
							onPress={() => {
								Clipboard.setString(this.state.backupCode);
								ToastAndroid.show('Backup code copied to clipboard!', ToastAndroid.SHORT, ToastAndroid.CENTER);
							}}
						/>
					</Card>
				</Modal>
				<FlatList
					style={styles.sectionList}
					data={this.state.settingOptions}
					showsVerticalScrollIndicator={true}
					renderItem={({ item }) =>
						<Card
							title={item.section}
							containerStyle={{ margin: 0 }}
							titleStyle={{ textAlign: 'left' }}
						>
							{
								item.option.map((u, i) => {
									return (
										<TouchableNativeFeedback key={u.id} onPress={u.onPress}>
											<ListItem
												key={u.namide}
												title={u.name}
												containerStyle={{ borderBottomWidth: 0 }}
												hideChevron={true}
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
		justifyContent: 'center',
	},
	sectionList: {
		flex: 1
	},
});