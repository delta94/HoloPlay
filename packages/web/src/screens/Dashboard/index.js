// @flow
import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Input } from '@youtube-audio-player/components';
import { Link } from '@react-navigation/web';
import { actions, SearchResultContainer } from '@youtube-audio-player/core';

type Props = {
  navigation: Object
};

class Dashboard extends React.Component<Props> {
  static path = 'dashboard';

  static navigationOptions = () => ({
    title: 'Dashboard',
    linkName: 'Dashboard'
  });

  constructor(props: Object) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // TODO: remove timeout and wait load user informations before run this action
    setTimeout(() => actions.search(), 1000);
  }

  logout: Function;
  async logout() {
    await actions.logout();
    return this.props.navigation.navigate('LoginScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
        <Link routeName="FavorisScreen">Favoris</Link>
        <Input
          onChangeText={text => actions.setSearchValue(text)}
          placeholder="Rechercher..."
        />
        <Button
          title="Search"
          onPress={actions.search} />
        <SearchResultContainer onPress={index => actions.loadSource(index)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});

export default Dashboard;