import React, {useState} from 'react';
import {Text, View, Pressable, Alert} from 'react-native';
import styles from '../modules/Styles';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';

const Settings = () => {
  const logOut = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/logout`,
        await EncryptedStorage.getItem('refreshToken'),
      );
      if (response.data.message === 'ok') {
        await EncryptedStorage.removeItem('refreshToken');
        Alert.alert('알림', '로그아웃 완료!');
      } else {
        Alert.alert('알림', '토큰이 없습니다');
      }
    } catch (error) {
      Alert.alert('알림', error.response.data.message);
    }
  };
  return (
    <View>
      <Text>세팅 페이지</Text>
      <View style={{width: 105, alignSelf: 'center'}}>
        <View style={styles.SignUpButtonActive}>
          <Pressable onPress={logOut}>
            <Text style={styles.loginButtonText}>로그아웃 하기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Settings;
