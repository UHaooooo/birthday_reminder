import React, { Component } from 'react';
import {
	StyleSheet,
	Button,
	Text,
	View
} from 'react-native';

export default class HomeScreen extends Component<Props> {
	/**
	 * A screen component can set navigation options such as the title.
	 */
	static navigationOptions = {
		title: 'Navigation Demo',
	};

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