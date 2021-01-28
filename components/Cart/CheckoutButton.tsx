import { ActionLink } from '@components/ActionLink';
import React from 'react';
import Cookies from 'js-cookie';
import useCart from '@framework/cart/use-cart';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';


export interface CheckoutButtonProps {
  label: string;
}
export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ label }) => {
  const {data} = useCart();
  const { tracker } = useUniformTracker();

  // HACK: currently, tickets are the only digital items we are selling
  const hasTicketInCart = data.line_items.digital_items.length > 0;

  const checkoutEventHandler = async (e) => {
    e.preventDefault();
    if(hasTicketInCart) {
      // signals that we have registered for the conference to Uniform
      Cookies.set('has_checked_out_with_ticket', '1');
    }
    // hack: we are removing all cart strength when you check out
    // technically you could not complete checkout, but this works, mostly
    // ...I guess
    await tracker.removeIntent('cart');
    window.location.href = e.target.href;
  }

  return (
    <ActionLink
      label={label}
      href={'/api/bigcommerce/checkout/'}
      onClick={checkoutEventHandler}
    />
  );
};
