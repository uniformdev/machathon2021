import { Entry } from 'contentful';
import React from 'react';
import { TalkFields } from '../lib/contentful';

export const TalksContext = React.createContext<Entry<TalkFields>[] | undefined>(undefined);
