import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 0.35,
    alignItems: 'center',
  },
  SignUpButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 0.35,
    alignItems: 'center',
  },
  SignUpButtonActive: {
    backgroundColor: 'salmon',
  },
  loginButtonActive: {
    backgroundColor: 'lightblue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontWeight: 'bold',
    fontSize: 18,
  },

  label: {fontWeight: 'bold', fontSize: 18, marginBottom: 20},
  inputWrapper: {
    padding: 20,
  },
});

export default styles;
