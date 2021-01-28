import { contentfulOptimizeListReader } from '@uniformdev/optimize-tracker-contentful';
import { Personalize } from '@uniformdev/optimize-tracker-react';
import { Entry } from 'contentful';
import { PersonalizedHeroFields } from '../lib/contentful';
import Splitter from './Splitter';

const PersonalizedHeroLoading = () => {
  return (
    <>
      <div className="pt-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left py-6 min-h-500"></div>
          <div className="w-full md:w-3/5 py-6 text-center">
            <div className="min-h-500"></div>
          </div>
        </div>
      </div>
      <Splitter />
    </>
  );
};

export const PersonalizedHero: React.FC<Entry<PersonalizedHeroFields>> = ({
  fields,
}) => {
  const variations = contentfulOptimizeListReader(fields.unfrmOptP13nList);
  return (
    <Personalize
      name="Personalized Hero"
      variations={variations}
      trackingEventName="heroPersonalized"
      loadingMode={PersonalizedHeroLoading}
    />
  );
};
