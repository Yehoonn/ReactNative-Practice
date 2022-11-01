import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
} from 'react-native';

const DisMissKeyboardView: React.FC<{style?: StyleProp<ViewStyle>}> =({
     ({children, ...props}) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView {...props} style={props.style}>
        {children}
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

export default DisMissKeyboardView;
