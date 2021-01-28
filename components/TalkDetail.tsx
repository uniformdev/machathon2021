import React from 'react';
import { PersonalizableListItem } from '@uniformdev/optimize-tracker-common';
import { PageFields, TalkFields } from '../lib/contentful';
import { useBehaviorTracking } from '@uniformdev/optimize-tracker-react';
import { Entry } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { IntentLabel } from './IntentLabel';
import Splitter from './Splitter';

interface TalkListProps extends Entry<PageFields>, PersonalizableListItem {
  talkDetail?: Entry<TalkFields>;
}

const TalkDetail: React.FC<TalkListProps> = ({ fields, talkDetail }) => {
  useBehaviorTracking(talkDetail?.fields.unfrmOptIntentTag);

  if (!talkDetail) {
    return (
      <section className="bg-white border-b py-8">
        <div className="container mx-auto flex flex-wrap pt-4 pb-12">
          <p>Invalid session</p>
        </div>
      </section>
    );
  }

  const { fields: talk } = talkDetail;

  return (
    <>
      <div className="pt-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col justify-center items-start text-center md:text-left my-12">
            <p className="uppercase tracking-loose w-full">Session</p>
            <h1 className="my-4 text-5xl font-bold leading-tight">
              {talk.title}
            </h1>
            <p className="leading-normal text-2xl mb-8">{talk.speaker}</p>
          </div>
        </div>
      </div>
      <Splitter />
      <section className="bg-white border-b ">
        <div className="container mx-auto pt-12 pb-12">
          <div className="text-gray-800 px-6 flex items-center">
            <div className="text-sm font-bold">Intended Audience:</div>
            <div className="mt-3 mb-3 flex items-center justify-start">
              {talk.unfrmOptIntentTag
                ? Object.keys(
                    talk.unfrmOptIntentTag.intents
                  ).map((intentId, key) => (
                    <IntentLabel key={key} intentId={intentId} />
                  ))
                : null}
            </div>{' '}
          </div>
          <div
            className="text-gray-800 px-6 pb-6 text-sm"
            dangerouslySetInnerHTML={{
              __html: documentToHtmlString(talk.description),
            }}
          />
        </div>
      </section>
    </>
  );
};

export default TalkDetail;
