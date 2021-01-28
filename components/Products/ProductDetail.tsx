import { useState, useEffect } from 'react';
import { useCartAction } from '@lib/cart/hooks';
import { useAppContext } from '@lib/contexts';
import Splitter from '@components/Splitter';
import {
  useBehaviorTracking,
  useUniformTracker,
} from '@uniformdev/optimize-tracker-react';
import {
  IntentTagStrength,
  IntentTagVector,
} from '@uniformdev/optimize-common';

interface BCCustomFieldValue {
  name: string;
  value: string;
}

export const ProductDetail: React.FC<any> = ({ fields, productDetail }) => {
  const { name, images, price, description, id, options, variants } =
    productDetail || {};
  const { addToCart } = useCartAction();
  const { isCartOpen, openCart } = useAppContext();
  const { tracker, intentScores } = useUniformTracker();
  const [colorVariant, setColorVariant] = useState(undefined);
  const [imageVariant, setImageVariant] = useState(undefined);

  useEffect(() => {
    // revalidate the state as moving from one product page to another
    // does not reset the useState prop and adding to basket adds the
    // previous order in state, this is not an issue browsing to other pages
    setColorVariant(undefined);
    (async () => {
      const hasVariant = await tracker?.getAttributeValues('Color');      
      if (hasVariant && Object.keys(hasVariant).length) {
        const mostRelevant = Object.entries(hasVariant)
          .sort((entryA, entryB) => entryB[1] - entryA[1])
          .map((item) => {
            return {
              name: item[0],
              value: item[1],
            };
          })[0];
        const bestMatchedVariant = variants.find((item) => {
          return item.option_values.some((color) => {
            return color.label === mostRelevant.name;
          });
        });
        setColorVariant(bestMatchedVariant);
        setImageVariant(bestMatchedVariant.image_url);        
      }
      else {
        setImageVariant(variants[0]?.image_url || images[0]?.url_standard);
      }
    })();
  }, [id, tracker, intentScores]);

  const customFields = productDetail.custom_fields as
    | Array<BCCustomFieldValue>
    | undefined;
  const intentTag: IntentTagVector = customFields
    ?.filter((f) => f.name === 'intent')
    // reduce custom fields with intent into an intent tag
    .reduce<IntentTagVector>((currentIntentVector, field) => {
      if (!field.value) return currentIntentVector;

      // reduce comma separated custom field intent values to an intent tag
      const localIntents = field.value
        .split(',')
        .reduce<IntentTagVector>((localIntentVector, intent) => {
          localIntentVector[intent] = { str: IntentTagStrength.Normal };

          return localIntentVector;
        }, {});

      // merge custom field intent values with any existing intent tag
      return { ...currentIntentVector, ...localIntents };
    }, {});

  useBehaviorTracking({ intents: intentTag });

  const addToBasket = async (e) => {
    e.preventDefault();
    try {
      await addToCart(
        {
          productId: id,
          variantId: colorVariant?.id || undefined,
        },
        price
      );
      openCart();
    } catch (error) {
      console.warn(error);
    }
  };

  const colorSelectionHandler = async (
    entityId: number,
    image: string,
    color: string
  ) => {
    setColorVariant({ id: entityId });
    setImageVariant(image || images[0]?.url_standard);
    await tracker.addAttribute({
      name: 'Color',
      value: color,
      str: 50,
    }, { clearValues: true });
  };

  const shouldDisable = () => {
    return variants.length > 1 && !colorVariant ? true : false;
  };

  return (
    <>
      <div className="mt-24">
        <Splitter />
      </div>
      <section className="bg-white border-b py-12">
        <div className="container mx-auto px-6">
          <div className="md:flex md:items-center">          
            {!imageVariant && 
              // hack for layout shift
              <div className="md:w-1/2 h-500 rounded-md mx-auto block object-scale-down"></div>
            }
            {imageVariant && <img
              className="md:w-1/2 max-h-500 rounded-md mx-auto block object-scale-down"
              src={imageVariant}
              alt={name}
              width="612"
              height="400"
              loading="lazy"
            />}            
            <div className="max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">
              <h3 className="text-gray-700 text-lg font-bold">{name}</h3>
              <span className="text-gray-500 mt-3">${price}</span>
              <hr className="my-3" />
              <div className="mt-2">
                <span className="text-gray-700 text-sm" data-for="count">
                  {fields.quantityLabel}:
                </span>
                <span className="text-gray-700 text-sm mx-2">1</span>
              </div>
              {options.length && (
                <div className="mt-3">
                  <label className="text-gray-700 text-sm" data-for="count">
                    {colorVariant
                      ? fields.colorLabel
                      : `Choose ${fields.colorLabel}`}
                  </label>
                  <div className="flex items-center mt-1">
                    {variants &&
                      Array.isArray(variants) &&
                      variants.map((item) => {
                        const variant = item;
                        return item.option_values.map((option) => {
                          const colorClass = option.label.toLowerCase();
                          return (
                            <button
                              title={option.label}
                              className={`h-10 w-10 rounded-full bg-${colorClass}-600 border-2 border-${colorClass}-200 mr-2 focus:animate-ping hover:animate-ping`}
                              onClick={() =>
                                colorSelectionHandler(
                                  variant.id,
                                  variant.image_url,
                                  option.label
                                )
                              }
                              key={option.id}
                            ></button>
                          );
                        });
                      })}
                  </div>
                </div>
              )}
              {description && (
                <div className="mt-3">
                  <h4 className="text-gray-700 text-lg">
                    {fields.descriptionLabel}
                  </h4>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                </div>
              )}
              <div className="flex items-center mt-6">
                <button
                  className="disabled:opacity-50 disabled:cursor-not-allowed pr-8 pl-4 py-4 gradient flex items-center text-white font-bold rounded-full hover:opacity-90 focus:outline-none focus:opacity-90 transition-opacity"
                  disabled={shouldDisable()}
                  onClick={addToBasket}
                >
                  <svg
                    className="h-5 w-5 mr-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  {fields.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
