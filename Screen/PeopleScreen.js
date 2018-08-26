import React, { Component } from 'react';
import {
	StyleSheet,
	Button,
	Text,
	View
} from 'react-native';

export default class PeopleScreen extends Component<Props> {
	static navigationOptions = {
		title: 'Lim Yu Hao',
	};

	render() {
		return (
			<View style={styles.container}>
				
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
	}
});