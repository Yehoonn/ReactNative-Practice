import axios from 'axios';
import React, {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';
import {RootState} from '../store/reducer';
import {Order} from '../slices/order';

const OrdersItem = ({data}: {data: Order}) => {
  const dispatch = useAppDispatch();
  const Token = useSelector((state: RootState) => state.user.accessToken);

  const addMoney = async () => {
    try {
      await axios.post(
        `${Config.API_URL}/money`,
        {money: data.price},
        {
          headers: {
            authorization: Token,
          },
        },
      );
      dispatch(userSlice.actions.addMoney(data.price));
    } catch (error) {
      console.log(error);
    }
  };

  const orderDetail = useCallback(() => {
    console.log('하이');
  }, []);

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: 'salmon',
        width: 300,
        height: 90,
        borderRadius: 5,
      }}
      onPress={orderDetail}>
      <View
        style={{
          flex: 1.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 25}}>{data.menu}</Text>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>
          {data.price.toLocaleString()}원
        </Text>
      </View>
      <View
        style={{
          flex: 0.5,
          width: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
          {data.startLocal}
        </Text>
        <Text>▼</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{data.endLocal}</Text>
      </View>
    </Pressable>
  );
};

export default OrdersItem;
