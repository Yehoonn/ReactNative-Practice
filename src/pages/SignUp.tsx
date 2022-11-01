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
import DisMissKeyboardView from '../components/DismissKeyboardView';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: SignInScreenProps) => {
  const emailRef = useRef<TextInput | null>(null);
  const passWordRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [name, setName] = useState('');
  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }

    if (!name || !name.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }

    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요');
    }

    Alert.alert('알림', '로그인을 시도합니다');
  }, [email, password, name]);

  const cangoNext = email && password && name;

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

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
          onSubmitEditing={onSubmit}
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
          disabled={!cangoNext}>
          <Text style={styles.loginButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </DisMissKeyboardView>
  );
};

export default SignIn;
