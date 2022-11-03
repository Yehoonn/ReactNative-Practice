import React, {useCallback} from 'react';
import {View, Text, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import OrdersItem from '../components/OrdersItem';
import {Order} from '../slices/order';

const Orders = () => {
  const orders = useSelector((state: RootState) => state.order.orders);

  const orderArray = useCallback(({item}: {item: Order}) => {
    return <OrdersItem data={item} />;
  }, []);

  return (
    <View>
      <View
        style={{
          backgroundColor: 'lightgreen',
          height: 50,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 25,
          }}>
          총 {orders.length}개의 주문이 있습니다
        </Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={orderArray}
        style={{marginBottom: 50}}
      />
    </View>
  );
};

export default Orders;
