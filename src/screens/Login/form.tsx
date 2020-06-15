import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import { actions } from '../../store';
import Spacer from '../../components/Spacer';
import { PUBLIC_INVIDIOUS_INSTANCES } from '../../constants';

interface Props {
  navigation: any;
  loginIsFetching: boolean;
}

const LoginForm: React.FC<Props> = ({ navigation, loginIsFetching }) => {
  const [instance, setInstance] = useState<string>(
    PUBLIC_INVIDIOUS_INSTANCES[0].value
  );
  const [customInstance, setCustomInstance] = useState<boolean>(false);
  const [token, setToken] = useState<null | string>(null);

  const onValueChange = (value: string): void => {
    if (value === 'other') {
      return setCustomInstance(true);
    }

    return setInstance(value);
  };

  const login = async (): Promise<any> => {
    try {
      if (token !== '' && token !== null) {
        await Promise.all([
          AsyncStorage.setItem('instance', instance),
          AsyncStorage.setItem('token', token)
        ]);
        actions.setLoginIsFetched();
        actions.setConnected();
        return goToDashboard();
      }
    } catch (error) {
      await actions.setLoginIsFetched();
      actions.setFlashMessage(error.message);
    }
  };

  const goToDashboard = (): void => navigation.navigate('Dashboard');

  return (
    <>
      <Picker selectedValue={instance} onValueChange={onValueChange}>
        {PUBLIC_INVIDIOUS_INSTANCES.map(({ value, label }, index) => (
          <Picker.Item key={index} label={label} value={value} />
        ))}
      </Picker>
      <TextInput
        accessibilityStates={[]}
        mode="outlined"
        label="Token"
        value={token as string}
        onChangeText={setToken}
      />
      <Spacer height={20} />
      {customInstance && (
        <>
          <TextInput
            accessibilityStates={[]}
            mode="outlined"
            label="Instance"
            value={instance}
            onChangeText={setInstance}
          />
          <Spacer height={20} />
        </>
      )}
      {/* @ts-ignore */}
      <Button mode="contained" onPress={login} loading={loginIsFetching}>
        Save token
      </Button>
      <Spacer height={20} />
      <View style={{ justifyContent: 'flex-end' }}>
        {/* @ts-ignore */}
        <Button mode="outlined" onPress={goToDashboard}>
          Skip
        </Button>
      </View>
    </>
  );
};

export default LoginForm;
