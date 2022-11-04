import React, {useCallback, useEffect} from 'react';
import {Text, View, Pressable, Alert} from 'react-native';
import styles from '../modules/Styles';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useAppSelector} from '../store/reducer';
import {useAppDispatch} from '../store';

const Settings = () => {
  const name = useAppSelector(state => state.user.name);
  const money = useAppSelector(state => state.user.money);
  const accessToken = useAppSelector(state => state.user.accessToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getMoney = async () => {
      try {
        const response = await axios.get<{data: number}>(
          `${Config.API_URL}/showmethemoney`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        );
        dispatch(userSlice.actions.setMoney(response.data.data));
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMoney();
  }, [accessToken, dispatch]);

  const logOut = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/logout`,
        {},
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );
      Alert.alert('알림', '로그아웃 완료!');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.log(errorResponse);
    }
  }, [accessToken, dispatch]);

  return (
    <View>
      <View style={styles.money}>
        <Text style={styles.moneyText}>{`${name}님의 수익금`}</Text>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          {money === undefined || money === null ? 0 : money.toLocaleString()}원
        </Text>
      </View>
      <View style={{width: 130, alignSelf: 'center', marginTop: 20}}>
        <View
          style={[
            styles.SignUpButtonActive,
            {
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
            },
          ]}>
          <Pressable onPress={logOut}>
            <Text style={[styles.loginButtonText]}>로그아웃 하기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Settings;
