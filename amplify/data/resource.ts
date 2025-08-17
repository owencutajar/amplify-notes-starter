import { a, defineData } from '@aws-amplify/backend';

export const data = defineData({
  schema: a.schema({
    Note: a.model({
      text: a.string().required(),
      done: a.boolean().default(false),
      createdAt: a.datetime().required(),
    }).authorization((allow) => [allow.publicApiKey()]),
  }),
});