import React from 'react';
import { PersonalizableListItem } from '@uniformdev/optimize-tracker-common';
import { TalksListFields } from '../lib/contentful';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { Entry } from 'contentful';
import { useAlgolia } from '@lib/algolia/useAlgolia';
import { buildIntentTagFilters } from '@lib/algolia/buildIntentTagFilters';
import { IndexedTalk } from '@lib/algolia/IndexedTalk';
import { Hit, SearchResponse } from '@algolia/client-search';
import { TalkListItem } from './TalkListItem';
import { useHasIntentScores } from '@lib/hooks/tracker';

interface TalkListProps extends Entry<TalksListFields>, PersonalizableListItem {
  talks?: SearchResponse<IndexedTalk>;
}

const TalkList: React.FC<TalkListProps> = (props) => {
  const { fields, talks } = props;
  const hasIntentScores = useHasIntentScores();
  const tags = Object.keys(fields.categoryFilter?.intents ?? {})
    .map((intent) => `intentTag:${intent}`)
    .join(' AND ');

  return (
    <section className="bg-white border-b py-8">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          {hasIntentScores ? fields.p13nTitle : fields.title}
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
        </div>
        {hasIntentScores ? (
          <PersonalizedTalkItems {...props} tags={tags} />
        ) : (
          <TalkItems
            hits={talks.hits}
            registerButtonText={fields.registerButtonText}
          />
        )}
      </div>
    </section>
  );
};

const PersonalizedTalkItems: React.FC<TalkListProps & { tags: string }> = (
  props
) => {
  const tracker = useUniformTracker();
  const { talks, fields, tags } = props;
  const { results: personalizedTalks } = useAlgolia<IndexedTalk>({
    index: 'talks',
    initialResults: talks ?? {
      hits: [],
      nbHits: 0,
    },
    search: async (index) =>
      await index.search('', {
        sumOrFiltersScores: true,
        getRankingInfo: true,
        hitsPerPage: fields.count,
        filters: tags,
        facetFilters: [
          buildIntentTagFilters({
            visitorScore: tracker.intentScores,
          }),
        ],
      }),
    dependencies: [tracker.intentScores],
  });
  return (
    <TalkItems
      hits={personalizedTalks.hits}
      registerButtonText={fields.registerButtonText}
    />
  );
};

const TalkItems = ({
  hits,
  registerButtonText,
}: {
  hits: Hit<IndexedTalk>[];
  registerButtonText: string;
}) => (
  <>
    {hits.map((talk) => (
      <TalkListItem
        key={talk.objectID}
        {...talk}
        buttonText={registerButtonText}
      />
    ))}
  </>
);

export default TalkList;
