import React, { Component } from 'react';
import {
	StyleSheet,
	Button,
	Text,
	View
} from 'react-native';

export default class SettingScreen extends Component<Props> {
	/**
	 * A screen component can set navigation options such as the title.
	 */
	static navigationOptions = {
		title: 'Navigation Demo',
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>
					Home
        </Text>
				<View style={styles.button}>
					<Button
						title="Chicken"
						onPress={() => { this.props.navigation.navigate('Chicken') }}
					/>
				</View>
				<View style={styles.button}>
					<Button
						title="Duck"
						onPress={() => { this.props.navigation.navigate('Duck') }}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		margin: 20,
	},
	button: {
		margin: 10,
	}
});