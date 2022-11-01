import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../../App';
import styles from '../modules/Styles';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: SignInScreenProps) => {
  const emailRef = useRef<TextInput | null>(null);
  const passWordRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요');
    }
    Alert.alert('알림', '로그인을 시도합니다');
  }, [email, password]);

  const cangoNext = email && password;

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <View>
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
      <View style={styles.buttonBox}>
        <Pressable
          onPress={onSubmit}
          style={
            !cangoNext
              ? styles.loginButton
              : StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
          }
          disabled={!cangoNext}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable
          onPress={toSignUp}
          style={StyleSheet.compose(
            styles.SignUpButton,
            styles.SignUpButtonActive,
          )}>
          <Text style={styles.loginButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;
