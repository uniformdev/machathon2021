import { useAppContext } from '@lib/contexts';
import { useCartAction } from '@lib/cart/hooks';

const Tickets: React.FC<any> = (props) => {
  const { fields, tickets } = props;
  const { title, buttonText } = fields;
  return (
    <section className="bg-gray-100 py-8">
      <div className="container mx-auto px-2 pt-4 pb-12 text-gray-800">
        <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          {title}
        </h1>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
        </div>
        <div className="flex flex-col sm:flex-row justify-center pt-12 my-12 sm:my-4">
          {tickets &&
            Array.isArray(tickets) &&
            tickets
              .filter((t) => t)
              .map((ticket, index) => (
                <TicketItem
                  key={index}
                  {...ticket}
                  featured={index === 1}
                  buttonText={buttonText}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

const BuyTicketButton = ({ title, onClick }) => (
  <div className="flex items-center justify-center">
    <button
      onClick={onClick}
      className="mx-auto lg:mx-0 hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
    >
      {title}
    </button>
  </div>
);

const TicketItem: React.FC<any> = ({
  id,
  base_variant_id,
  name,
  buttonText,
  description,
  featured,
  price,
  highlights,
}) => {
  const { addToCart } = useCartAction();
  const { openCart } = useAppContext();

  const handleAddTicketClick = async (e: any) => {
    e.preventDefault();

    await addToCart(
      {
        productId: id,
        variantId: base_variant_id,
      },
      price
    );

    openCart();
  };

  return (
    <div
      className={
        featured
          ? 'flex flex-col w-5/6 lg:w-1/3 mx-auto lg:mx-0 rounded-lg bg-white mt-4 sm:-mt-6 shadow-lg z-10'
          : 'flex flex-col w-5/6 lg:w-1/4 mx-auto lg:mx-0 rounded-none lg:rounded-l-lg bg-white mt-4'
      }
    >
      <div
        className={
          featured
            ? 'flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow'
            : 'flex-1 bg-white text-gray-600 rounded-t rounded-b-none overflow-hidden shadow'
        }
      >
        <div
          className={
            featured
              ? 'w-full p-8 text-3xl font-bold text-center'
              : 'p-8 text-3xl font-bold text-center border-b-4'
          }
        >
          {name}
        </div>
        {featured && (
          <div className="h-1 w-full gradient my-0 py-0 rounded-t"></div>
        )}
        {description && (
          <div
            className="p-8 text-l text-center"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <ul
          className={
            featured
              ? 'w-full text-center text-sm font-bold'
              : 'w-full text-center text-sm'
          }
        >
          {highlights &&
            Array.isArray(highlights) &&
            highlights.map((highlight, index) => (
              <li key={index} className="border-b py-4">
                {highlight}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
        <div className="w-full pt-6 text-3xl text-gray-600 font-bold text-center">
          ${price}
        </div>
        <BuyTicketButton title={buttonText} onClick={handleAddTicketClick} />
      </div>
    </div>
  );
};

export default Tickets;
