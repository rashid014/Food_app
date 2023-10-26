
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  isLoading: false, // Set to false initially
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      state.isLoading = false;
    },
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cart.find(item => item._id === newItem._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push(newItem);
      }
    },
    removeItemFromCart: (state, action) => {
      const itemIdToRemove = action.payload;
      const itemToRemoveIndex = state.cart.findIndex(item => item._id === itemIdToRemove);

      if (itemToRemoveIndex !== -1) {
        const itemToRemove = state.cart[itemToRemoveIndex];

        if (itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
        } else {
          state.cart.splice(itemToRemoveIndex, 1);
        }
      }
    },
    removeAllItemsFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    },
  },
});

export const { setCart, addItemToCart, removeItemFromCart, removeAllItemsFromCart } = cartSlice.actions;

// Middleware to update local storage when the cart state changes
export const updateLocalStorageMiddleware = store => next => action => {
  const result = next(action);
  const cartState = store.getState().cart;
  console.log('Updated Cart State:', cartState);

  // Save the updated cart state to local storage
  localStorage.setItem('cart', JSON.stringify(cartState.cart));

  return result;
};

export default cartSlice.reducer;
