import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';
import{
  SearchBar,
} from 'react-native-elements';

export default class MonthScreen extends Component<Props> {
  static navigationOptions = {
    title: 'AUGUST',
  };

  state = {
    searchClearIcon:false
  }

  _onChangeSearchText = (searchText) => {
		if(searchText){
			this.setState({searchClearIcon: true})
		}else{
			this.setState({searchClearIcon:false})
		}
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
        <Text style={styles.title}>
          Month
        </Text>
        <View style={styles.button}>
          <Button
            title="Chicken"
            onPress={() => {this.props.navigation.navigate('Chicken')}}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Duck"
            onPress={() => {this.props.navigation.navigate('Duck')}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
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