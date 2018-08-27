import React, { Component } from 'react';
import {
	StyleSheet,
	FlatList,
	View,
	TouchableNativeFeedback,
	Alert,
} from 'react-native';
import {
	Card,
	ListItem,
	Text,
	Button
} from 'react-native-elements';
import Modal from 'react-native-modal';
import {
	MKButton,
} from 'react-native-material-kit';

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
		};

		this._firstTimeBackup = this._firstTimeBackup.bind(this);
		this._backupUsingCode = this._backupUsingCode.bind(this);
		this._backup = this._backup.bind(this);
		this._restore = this._restore.bind(this);
		this._toggleBackupModal = this._toggleBackupModal.bind(this);
		this._toggleRestoreModal = this._toggleRestoreModal.bind(this);
		this._toggleScreenshotModal = this._toggleScreenshotModal.bind(this);
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
						onPress: this._backupUsingCode
					}
				],
			},
			{
				section: 'Restore',
				option: [
					{
						id: '3',
						name: 'Restore using Backup Code',
						onPress: this._restore
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

	_backup() {
		Alert.alert('Your records will be backup to cloud.', 'Are you sure?', [
			{
				text: 'Yes',
				onPress: () => {
					// use fetch to store data to cloud database
					Alert.alert(this.state.backupCode);
				},
			},
			{
				text: 'No',
				onPress: () => { },
			},
		], { cancelable: false });
	}

	_firstTimeBackup() {
		this.setState({
			backupCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
		})

		this._backup();
	}

	_backupUsingCode() {
		this._toggleBackupModal();
		//Alert.alert(this.state.codeModalMode);
		//this._backup();
	}

	_restore() {

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
						<View style={{ flex: 1 }}>
							<Button title='BACKUP' backgroundColor='#99CC33' buttonStyle={{ flex: 1 }} />
							<Button title='CANCEL' buttonStyle={{ flex: 1 }} />
						</View>
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