import { IndexedTalk } from '@lib/algolia/IndexedTalk';
import Link from 'next/link';
import React from 'react';
import { IntentLabel } from './IntentLabel';

export const TalkListItem: React.FC<IndexedTalk & { buttonText: string }> = (
  props
) => {
  const { buttonText, description, intentTag, name, slug, speaker } = props;

  return (
    <div className="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
      <div className="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow pt-2 flex flex-col justify-between">
        <div>
          <Link href="/talks/[id]" as={`/talks/${slug}`}>
            <a className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full font-bold text-xl text-gray-800 px-6">
                {name}
              </div>
            </a>
          </Link>

          <div className="text-gray-800 px-6 pt-1 text-xs italic leading-none">
            {speaker}
          </div>

          <div
            className="text-gray-800 px-6 pb-6 pt-4 text-sm"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
        <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden">
          <div className="mb-4 flex items-center justify-start flex-wrap">
            {intentTag.map((intentId, key) => (
              <IntentLabel key={key} intentId={intentId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
