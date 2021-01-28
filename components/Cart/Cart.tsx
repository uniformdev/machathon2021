import { CartItem } from './CartItem';
import useCart from '@framework/cart/use-cart';
import usePrice from '@framework/use-price';
import { useAppContext } from '@lib/contexts';
import { useEffect } from 'react';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { CheckoutButton } from './CheckoutButton';

type Props = {
  checkoutLabel?: string | undefined;
  discountButtonLabel?: string | undefined;
};

export const Cart: React.FC<Props> = ({
  checkoutLabel = 'Checkout',
  discountButtonLabel = 'Apply',
}) => {
  const { tracker } = useUniformTracker();
  const { isCartOpen, closeCart, toggleCart } = useAppContext();
  const { data, isEmpty } = useCart();

  useEffect(() => {
    if (isEmpty) {
      if (tracker) {
        tracker.removeIntent('cart');
      }
    }
  }, [isEmpty]);

  const { price: subTotal } = usePrice(
    data && {
      amount: data.base_amount,
      currencyCode: data.currency.code,
    }
  );
  const { price: total } = usePrice(
    data && {
      amount: data.cart_amount,
      currencyCode: data.currency.code,
    }
  );
  const physicalItems = data?.line_items.physical_items ?? [];
  const digitalItems = data?.line_items.digital_items ?? [];
  const items = physicalItems.concat(digitalItems);

  return (
    <>
      {isCartOpen && (
        <div
          className="z-10 fixed top-0 left-0 right-0 h-full bg-white animate-fadeIn60"
          onClick={closeCart}
        ></div>
      )}
      <div
        className={`
        z-20 fixed right-0 max-w-xs w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300
        ${isCartOpen ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'}
        `}
        style={{
          top: '76px',
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-gray-700">Your cart</h2>
          <button
            aria-label="Add to cart"
            onClick={() => toggleCart()}
            className="text-gray-600 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <hr className="my-3" />

        <div className="my-4">
          {items &&
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                currencyCode={data?.currency.code}
              />
            ))}
        </div>
        {items && items.length ? (
          <CheckoutButton label={checkoutLabel} />
        ) : (
          <p className="flex items-center justify-center mt-4 mx-auto lg:mx-0 lg:mt-0 py-4 px-8 text-gray-800">
            Your cart is empty
          </p>
        )}
      </div>
    </>
  );
};
