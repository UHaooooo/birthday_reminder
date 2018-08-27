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

export default class SettingScreen extends Component<Props> {
	/**
	 * A screen component can set navigation options such as the title.
	 */
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
			errorMessage: ''
		};

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

	_firstTimeBackup() {
		this.setState({
			backupCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
		})

		Alert.alert('Your records will be backup to cloud.', 'Are you sure?', [
			{
				text: 'Yes',
				onPress: () => {
					// use fetch to store data to cloud database
					// insert a new user using the backup code
					// use that user_id, insert many birthday record
					// after done, show modal with Backup Code
					// After the modal closed, setState backupCode = ''
					//Alert.alert(this.state.backupCode);
					this._toggleScreenshotModal();
				},
			},
			{
				text: 'No',
				onPress: () => { },
			},
		], { cancelable: false });
	}

	_backup() {
		Alert.alert('Your records will be backup to cloud.', 'Are you sure?', [
			{
				text: 'Yes',
				onPress: () => {
					// use fetch to store data to cloud database
					// if backup code found, delete all its birthday_record, insert all from local into table
					// if backup code not found, alert not found, toggle backup modal
					//after done, setState backupCode = ''
					Alert.alert(this.state.backupCode);
					this._toggleBackupModal();
					this.setState({
						backupCode: ''
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
					// use fetch to get data from cloud database
					// if backup code found, delete all local records, insert all from cloud to local into table
					// if backup code not found, alert not found, toggle backup modal
					//after done, setState backupCode = ''
					Alert.alert(this.state.backupCode);
					this._toggleRestoreModal();
					this.setState({
						backupCode: ''
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