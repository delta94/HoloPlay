import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import {
  Searchbar,
  Text,
  TouchableRipple,
  IconButton
} from 'react-native-paper';
import { actions } from '../../../store';

const SEARCH_INPUT_PLACEHOLDER = 'Search music';
const SEARCH_EMPTY_VALUE = 'Add search value';

type History = string;

interface SearchProps {
  history: string[];
}

interface SearchSubmenuProps {
  isOpen: boolean;
  selectValue: Function;
  items: string[];
}

const Search: React.FC<SearchProps> = ({ history }) => {
  const [value, setValue] = useState<null | string>(null);
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

  const searchThroughApi = (): void => {
    if (value !== '' && value !== null) {
      return actions.search(value);
    }

    return actions.setFlashMessage(SEARCH_EMPTY_VALUE);
  };

  const toggleSubmenu = (): void => setShowSubmenu(!showSubmenu);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Searchbar
          accessibilityStates={[]}
          placeholder={SEARCH_INPUT_PLACEHOLDER}
          onChangeText={setValue}
          onIconPress={searchThroughApi}
          value={value ?? ''}
        />
      </View>
      {history.length > 0 && (
        <>
          <IconButton
            accessibilityStates={[]}
            icon="history"
            color="white"
            size={30}
            onPress={toggleSubmenu}
          />
          <Submenu
            items={history}
            selectValue={(value: string) => {
              setValue(value);
              toggleSubmenu();
            }}
            isOpen={showSubmenu}
          />
        </>
      )}
    </View>
  );
};

const Submenu: React.FC<SearchSubmenuProps> = ({
  isOpen,
  selectValue,
  items
}) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  });

  return (
    <Animated.View
      style={[styles.submenu, { opacity }]}
      pointerEvents={isOpen ? 'auto' : 'none'}>
      {items.map((text, index) => (
        // @ts-ignore
        <TouchableRipple key={index} onPress={() => selectValue(text)}>
          <View
            style={{
              borderTopColor: '#bdc3c7',
              borderTopWidth: index === 0 ? 0 : 1,
              padding: 7
            }}>
            <Text accessibilityStates={[]}>{text}</Text>
          </View>
        </TouchableRipple>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: 'row'
  },
  submenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    elevation: 2,
    backgroundColor: 'white',
    zIndex: 2,
    borderRadius: 4
  }
});

export default Search;