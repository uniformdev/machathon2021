import useCartActions from '@framework/cart/use-cart-actions';
import { AddItemInput } from '@framework/cart/use-add-item';
import { RemoveItemInput } from '@framework/cart/use-remove-item';
import { UpdateItemInput } from '@framework/cart/use-update-item';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';

export const useCartAction = () => {
  const { addItem, removeItem, updateItem } = useCartActions();
  const { tracker } = useUniformTracker();

  return {
    addToCart: async (input: AddItemInput, price: number) => {
      await addItem(input);
      if (tracker) {
        tracker.addIntentStrength('visitor', { cart: { str: Math.max(1, price) } });
      }
    },
    removeFromCart: async (input: RemoveItemInput, price: number) => {
      await removeItem(input);
      if (tracker) {
        tracker.addIntentStrength('visitor', { cart: { str: -price } });
      }
    },
    updateItemInCart: async (input: UpdateItemInput, price: number) => {
      await updateItem();
      // TODO: Not sure what's best here
      // if (tracker) {
      //   tracker.addIntentStrength('visitor', { cart: { str: price } });
      // }
    },
  };
};
