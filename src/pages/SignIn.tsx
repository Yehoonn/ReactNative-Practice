import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import DisMissKeyboardView from '../components/DismissKeyboardView';
import styles from '../modules/Styles';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: SignInScreenProps) => {
  const dispatch = useAppDispatch();
  const emailRef = useRef<TextInput | null>(null);
  const passWordRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [loading, setLoading] = useState<boolean | null>(null);
  const onSubmit = useCallback(async () => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요');
    }
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/login`, {
        email,
        password,
      });
      Alert.alert('알림', '로그인 완료');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          money: response.data.data.money,
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.log(error);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, email, password]);

  const cangoNext = email && password;

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <DisMissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          ref={emailRef}
          returnKeyType="next"
          placeholder="이메일을 입력해주세요"
          onChangeText={text => {
            setEmail(text.trim());
          }}
          onSubmitEditing={() => {
            passWordRef.current?.focus();
          }}
          blurOnSubmit={false}
          value={email}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          clearButtonMode="while-editing"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          ref={passWordRef}
          placeholder="비밀번호를 입력해주세요"
          onChangeText={text => {
            setPassWord(text.trim());
          }}
          value={password}
          secureTextEntry={true}
          onSubmitEditing={onSubmit}
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
        />
      </View>
      {loading === true ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.buttonBox}>
          <Pressable
            onPress={onSubmit}
            style={
              !cangoNext
                ? styles.loginButton
                : StyleSheet.compose(
                    styles.loginButton,
                    styles.loginButtonActive,
                  )
            }
            disabled={!cangoNext || loading}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable
            onPress={toSignUp}
            style={StyleSheet.compose(
              styles.SignUpButton,
              styles.SignUpButtonActive,
            )}
            disabled={!!loading}>
            <Text style={styles.loginButtonText}>회원가입</Text>
          </Pressable>
        </View>
      )}
    </DisMissKeyboardView>
  );
};

export default SignIn;
