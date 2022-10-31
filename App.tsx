import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Pressable, Text, View} from 'react-native';
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Second: undefined;
};
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;
type SecondScreenProps = NativeStackScreenProps<ParamListBase, 'Second'>;

function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Pressable
        onPress={onClick}
        style={{padding: 20, backgroundColor: 'salmon'}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Home Screen</Text>
      </Pressable>
    </View>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(
    (address: string) => {
      navigation.navigate(address);
    },
    [navigation]
  );

  return (
    <>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: 'yellow',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={() => {
            onClick('Home');
          }}>
          <Text>홈페이지 돌아가기</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'orange',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={() => {
            onClick('Second');
          }}>
          <Text>두번째 페이지 보러가기</Text>
        </Pressable>
      </View>
    </>
  );
}

function SecondScreen({navigation}: SecondScreenProps) {
  const onClick = useCallback(
    (address: string) => {
      navigation.navigate(address);
    },
    [navigation]
  );

  const data: Array = [
    {
      text: '첫 번째 컴포넌트',
    },
    {
      text: '두 번째 컴포넌트',
    },
  ];

  return (
    <>
      <>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {data.map((value: Object, index: any) => {
            return <Items data={value} key={index} />;
          })}
        </View>
      </>
      <>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
            backgroundColor: 'yellow',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => {
              onClick('Details');
            }}>
            <Text>디테일 페이지 보러가기</Text>
          </Pressable>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'orange',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => {
              onClick('Home');
            }}>
            <Text>홈페이지 돌아가기</Text>
          </Pressable>
        </View>
      </>
    </>
  );
}

const Items = ({data}: object) => {
  return (
    <>
      <View style={{paddingLeft: 10, paddingTop: 10}}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{data.text}</Text>
      </View>
    </>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈화면'}}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{title: '디테일'}}
        />
        <Stack.Screen
          name="Second"
          component={SecondScreen}
          options={{title: '두번째'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
