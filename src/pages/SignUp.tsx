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
import styles from '../modules/Styles';
import DisMissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignUp = ({navigation}: SignInScreenProps) => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passWordRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [name, setName] = useState('');

  const cangoNext = email && password && name;

  const toSignUp = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Config.API_URL}/user`,
        {
          email,
          password,
          name,
        },
        {
          headers: {
            token: '고유한 값',
          },
        },
      );
      Alert.alert('알림', '회원가입 성공!');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log(error);
      const errorResponse = (error as AxiosError).response;
      console.log(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigation, email, password, name]);

  return (
    <DisMissKeyboardView behavior="position">
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
            nameRef.current?.focus();
          }}
          blurOnSubmit={false}
          value={email}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          ref={nameRef}
          placeholder="이름을 입력해주세요"
          onChangeText={text => {
            setName(text.trim());
          }}
          value={name}
          blurOnSubmit={false}
          importantForAutofill="yes"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => {
            passWordRef.current?.focus();
          }}
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
          onSubmitEditing={toSignUp}
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
        />
      </View>
      <View style={styles.buttonBox}>
        <Pressable
          onPress={toSignUp}
          style={
            !cangoNext
              ? styles.SignUpButton
              : StyleSheet.compose(
                  styles.SignUpButton,
                  styles.SignUpButtonActive,
                )
          }
          disabled={!cangoNext || loading}>
          {loading ? (
            <ActivityIndicator color="lightblue" />
          ) : (
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DisMissKeyboardView>
  );
};

export default SignUp;
