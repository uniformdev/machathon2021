import Link from 'next/link';
import { useBehaviorTracking } from '@uniformdev/optimize-tracker-react';

import Splitter from './Splitter';
import { HeroFields } from '../lib/contentful';
import { Entry } from 'contentful';

const Hero: React.FC<Entry<HeroFields>> = ({ fields }) => {
  useBehaviorTracking(fields?.unfrmOptIntentTag);

  const { title, description, buttonText, image, buttonLinkSlug } = fields;  
  const imageAttr = {
    width: image?.fields?.file?.details?.image?.width || 400,
    height: image?.fields?.file?.details?.image?.height || 400,
    alt: image?.fields?.title || 'Please provide image alt text',
    url: image?.fields?.file?.url
  }

  return (
    <>
      <div className="pt-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left min-h-500">
            <h1 className="my-4 text-5xl font-bold leading-tight">{title}</h1>
            <p className="leading-normal text-2xl mb-8">{description}</p>

            {buttonLinkSlug ? (
              <Link href={'/[[...slug]]'} as={buttonLinkSlug}>
                <a className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg">
                  {buttonText}
                </a>
              </Link>
            ) : null}
          </div>
          <div className="w-full md:w-3/5 py-6 text-center">
            {image && (
              <img
                className="w-full md:w-4/5 z-50 min-h-500 max-h-500"
                width={imageAttr.width}
                height={imageAttr.height}
                src={imageAttr.url}
                alt={imageAttr.alt}
                loading='lazy'
              />
            )}
          </div>
        </div>
      </div>
      <Splitter />
    </>
  );
};

export default Hero;
