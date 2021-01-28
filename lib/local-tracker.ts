import { createDefaultTracker } from '@uniformdev/optimize-tracker-browser';
import { DeliveryAPIResult } from '@uniformdev/optimize-common';
import { Analytics } from 'analytics';
import googleAnalyticsPlugin from '@analytics/google-analytics';
import segmentPlugin from '@analytics/segment';
import intentManifest from './intentManifest.json';
import { addAnalyticsPlugin } from '@uniformdev/optimize-tracker-analytics';
import getConfig from 'next/config';
import { createNextCookieStorage } from './nextCookieStorage';
import { NextPageContext } from 'next';
import { Tracker } from '@uniformdev/optimize-tracker-common';

const config = getConfig() || {};
const plugins = [];
const { publicRuntimeConfig } = config;

if (publicRuntimeConfig?.gaTrackingId) {
  plugins.push(
    googleAnalyticsPlugin({
      trackingId: publicRuntimeConfig.gaTrackingId,
      customDimensions: {
        strongestIntentMatch: 'dimension1',
        allIntentMatches: 'dimension2',
      },
    })
  );
}

if (publicRuntimeConfig?.segmentTrackingId) {
  plugins.push(
    segmentPlugin({
      writeKey: publicRuntimeConfig.segmentTrackingId,
    })
  );
}

const analytics = Analytics({
  app: 'Uniform Optimize Next.js Example',
  debug: true,
  plugins: plugins,
});

export const createLocalTracker = (ctx?: NextPageContext): Tracker =>
  createDefaultTracker({
    intentManifest: intentManifest as DeliveryAPIResult,
    addPlugins: [addAnalyticsPlugin({ analytics })],
    storage: {
      scoring: createNextCookieStorage(ctx),
    },
    logLevelThreshold: 'info',
  });

// demo of setting up a locally hosted tracker instance (not in a js bundle)
// this uses intents downloaded at build time and hosted in your local js bundle,
// instead of the JS bundle we put on s3 that includes all this prewired.
// good for: local dev, security consciousness, first-party JS hosting for cookie intents, etc
// bad for: evergreen updates
export const localTracker = createLocalTracker();
