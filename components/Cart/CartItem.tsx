import usePrice from '@framework/use-price';
import { useCartAction } from '@lib/cart/hooks';

type Props = {
  item: any;
  currencyCode: string;
};
export const CartItem: React.FC<Props> = ({ item, currencyCode }) => {
  const { id, product_id, variant_id, name, image_url, quantity } = item;
  const { removeFromCart } = useCartAction();
  const { price } = usePrice({
    amount: item.extended_sale_price,
    baseAmount: item.extended_list_price,
    currencyCode,
  });

  return (
    <div className="flex justify-between mt-6">
      <div className="flex">
        <img
          loading="lazy"
          className="h-20 w-20 object-cover rounded"
          src={image_url}
          alt={`${name} Image`}
          height="80"
          width="80"
        />
        <div className="mx-3">
          <h3 className="text-sm text-gray-600">{name}</h3>
          <div className="flex items-center mt-2">
            <span className="text-gray-700 mx-2">{quantity}</span>
            <button
              className={`text-gray-500 focus:outline-none focus:text-gray-600 transition-opacity ${
                quantity < 1 ? 'opacity-50' : ''
              }`}
              title="delete from baskest"
              value="decrease quantity"
              onClick={() => removeFromCart({ id }, item.extended_sale_price)}
              disabled={quantity < 1}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <span className="text-gray-600">{price}</span>
    </div>
  );
};
