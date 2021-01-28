import React from 'react';
import { Entry } from 'contentful';
import { FullCartFields } from '@lib/contentful';
import useCart from '@framework/cart/use-cart';
import usePrice from '@framework/use-price';
import { CartItem } from '@components/Cart/CartItem';
import { CheckoutButton } from './CheckoutButton';

interface FullCartProps extends Entry<FullCartFields> {}

export function FullCart({ fields }: FullCartProps) {
  const { data, isEmpty } = useCart();
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

  const items = []
    .concat(data?.line_items.digital_items)
    .concat(data?.line_items.physical_items);

  const error = null;
  const success = null;

  return (
    <section className="bg-white border-b py-8">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          Cart
        </h1>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
        </div>
        <div className="grid lg:grid-cols-12 text-gray-800 mt-10 mx-auto">
          <div className="lg:col-span-8">
            {isEmpty ? (
              <div className="flex-1 px-12 flex flex-col justify-center items-center ">
                <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
                  {/*<Bag className="absolute" />*/}
                  bag
                </span>
                <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
                  Your cart is empty
                </h2>
                <p className="text-accents-6 px-10 text-center pt-2">
                  Biscuit oat cake wafer icing ice cream tiramisu pudding
                  cupcake.
                </p>
              </div>
            ) : error ? (
              <div className="flex-1 px-4 flex flex-col justify-center items-center">
                <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
                  {/*<Cross width={24} height={24} />*/}
                  cross
                </span>
                <h2 className="pt-6 text-xl font-light text-center">
                  We couldn’t process the purchase. Please check your card
                  information and try again.
                </h2>
              </div>
            ) : success ? (
              <div className="flex-1 px-4 flex flex-col justify-center items-center">
                <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
                  {/*<Check />*/}
                  check
                </span>
                <h2 className="pt-6 text-xl font-light text-center">
                  Thank you for your order.
                </h2>
              </div>
            ) : (
              <div className="px-4 sm:px-6 flex-1">
                <p>Review your Order</p>
                <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accents-2 border-b border-accents-2">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      currencyCode={data?.currency.code!}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            <div className="flex-shrink-0 px-4 sm:px-6">
              <div className="border-t border-accents-2">
                <ul className="py-3">
                  <li className="flex justify-between py-1">
                    <span>Subtotal</span>
                    <span>{subTotal}</span>
                  </li>
                  <li className="flex justify-between py-1">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </li>
                  <li className="flex justify-between py-1">
                    <span>Estimated Shipping</span>
                    <span className="font-bold tracking-wide">FREE</span>
                  </li>
                </ul>
                <div className="flex justify-between border-t border-accents-2 py-3 font-bold mb-10">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div>
              <div className="flex flex-row justify-end">
                <div className="w-full lg:w-72">
                  {isEmpty ? (
                    <a href="/">Continue Shopping</a>
                  ) : (
                    <CheckoutButton label={'Proceed to checkout'} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
