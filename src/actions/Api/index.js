import AsyncStorage from '@react-native-community/async-storage';
import callApi from '../../utils/callApi';
import api from '../../api';

const apiState = {
  jwt: null,
  user: null,
  userId: null
};

const apiActions = {
  loginThroughApi: async (state, actions, formData) => {
    const { jwt, user } = await callApi(api.login, 'post', formData);
    await AsyncStorage.setItem('userToken', jwt);
    await AsyncStorage.setItem('userId', String(user.id));

    return {
      ...state,
      jwt,
      user,
      userId: user.id
    };
  },
  addUserToken: (state, actions, jwt) => {
    return {
      ...state,
      jwt
    };
  },
  addSourceToFavoris: async (state, action, source) => {
    const { _id, favoris, favorisIds } = state.user;
    const userUpdated = {
      favoris: [...favoris, source],
      favorisIds: [...favorisIds, source.id]
    };
    const user = {
      ...state.user,
      ...userUpdated
    };

    const headers = { Authorization: `Bearer ${state.jwt}` };
    await callApi(api.update(_id), 'put', userUpdated, headers);

    return {
      ...state,
      user
    };
  },
  removeSourceFromFavoris: async (state, action, source) => {
    const { _id, favoris, favorisIds } = state.user;
    const favorisFiltered = favoris.filter(item => item.id !== source.id);
    const favorisIdsFiltered = favorisIds.filter(id => id !== source.id);
    const userUpdated = {
      favoris: favorisFiltered,
      favorisIds: favorisIdsFiltered
    };
    const user = {
      ...state.user,
      ...userUpdated
    };

    const headers = { Authorization: `Bearer ${state.jwt}` };
    await callApi(api.update(_id), 'put', userUpdated, headers);

    return {
      ...state,
      user
    };
  },
  updateUser: async (state, actions, userUpdated) => {
    const { _id } = state.user;
    const headers = { Authorization: `Bearer ${state.jwt}` };
    await callApi(api.update(_id), 'put', userUpdated, headers);

    return state;
  }
};

export { apiState, apiActions };