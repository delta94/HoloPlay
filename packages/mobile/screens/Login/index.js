import React from 'react';
import { View, Button } from 'react-native';
import { Input } from '@youtube-audio-player/components';
import { actions } from '@youtube-audio-player/core';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    identifier: 'contact@stephane-richin.fr',
    password: 'steph0407'
  };

  async handleChange(key, value) {
    await this.setState({
      [key]: value
    });
  }

  render() {
    return (
      <View>
        <Input
          onChangeText={value => this.handleChange('identifier', value)}
          placeholder="identifier"
          value={this.state.identifier}
        />
        <Input
          onChangeText={value => this.handleChange('password', value)}
          placeholder="Password"
          value={this.state.password}
        />
        <Button
          title="Login"
          onPress={() => actions.loginThroughApi(this.state)}
        />
      </View>
    );
  }
}

export default Login;
