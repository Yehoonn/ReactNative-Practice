import {createSlice} from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: {orDer: ''},
  reducers: {
    test: (state, action) => {
      state.orDer = action.payload;
    },
  },
});

export default orderSlice;
