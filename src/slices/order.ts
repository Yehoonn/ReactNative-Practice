import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longituder: number;
  };
  end: {
    latitude: number;
    longituder: number;
  };
  price: number;
  menu: string;
  startLocal: string;
  endLocal: string;
}
export interface InitialState {
  orders: Order[];
  deliveries: Order[];
}

const initialState: InitialState = {
  orders: [],
  deliveries: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    acceptOrder: (state, action: PayloadAction<string>) => {
      const index = state.orders.findIndex(
        value => value.orderId === action.payload,
      );
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder: (state, action: PayloadAction<string>) => {
      const index = state.orders.findIndex(
        value => value.orderId === action.payload,
      );
      if (index > -1) {
        state.orders.splice(index, 1);
      }
      const delivery = state.deliveries.findIndex(
        value => value.orderId === action.payload,
      );
      if (delivery > -1) {
        state.deliveries.splice(index, 1);
      }
    },
  },
  extraReducers: builder => {},
});

export default orderSlice;
