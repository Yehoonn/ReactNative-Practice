import axios, {AxiosError} from 'axios';
import React, {useCallback, useState} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';
import {useAppSelector} from '../store/reducer';
import orderSlice, {Order} from '../slices/order';
import styles from '../modules/Styles';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';

const OrdersItem = ({data}: {data: Order}) => {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(false);
  const Token = useAppSelector(state => state.user.accessToken);

  const addMoney = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/money`,
        {money: data.price},
        {
          headers: {
            Authorization: Token,
          },
        },
      );
      dispatch(userSlice.actions.addMoney(data.price));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, data.price, Token]);

  const orderDetail = useCallback(() => {
    setDetail(value => !value);
  }, []);

  const orderAccept = useCallback(async () => {
    try {
      setLoading(true);
      let response = await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: data.orderId},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      console.log(response);
      if (response.data.status === 201) {
        dispatch(orderSlice.actions.acceptOrder(data.orderId));
        setLoading(false);
        navigation.navigate('Delivery');
      }
    } catch (error) {
      let errorResponse = (error as AxiosError).response;
      if (errorResponse?.status === 400) {
        Alert.alert('알림', errorResponse.data.message);
        dispatch(orderSlice.actions.rejectOrder(data.orderId));
      }
      setLoading(false);
    }
  }, [dispatch, data.orderId, Token, navigation]);

  const orderReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(data.orderId));
  }, [dispatch, data.orderId]);

  console.log('리랜더링');
  return (
    <View
      style={{
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: 'salmon',
        width: 300,
        borderRadius: 5,
        alignSelf: 'center',
      }}>
      <Pressable
        style={{
          flexDirection: 'row',
        }}
        onPress={orderDetail}>
        <View
          style={{
            flex: 0.9,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 23}}>{data.menu}</Text>
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
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            {data.endLocal}
          </Text>
        </View>
      </Pressable>
      {detail ? (
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text>네이버 맵이 들어갈 장소</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Pressable
              style={[styles.orderButton, {backgroundColor: 'black'}]}
              disabled={loading}
              onPress={orderAccept}>
              <Text style={[styles.orderText, {color: 'white'}]}>수락</Text>
            </Pressable>
            <Pressable
              style={[styles.orderButton, {backgroundColor: 'gray'}]}
              disabled={loading}
              onPress={orderReject}>
              <Text style={[styles.orderText, {color: 'black'}]}>거절</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(OrdersItem);
