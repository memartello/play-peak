import { relations } from 'drizzle-orm';
import {
  text,
  pgTable,
  uuid,
  doublePrecision,
  timestamp,
  smallint,
  boolean,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';

export const sport = pgTable('sport', {
  id: uuid('uuid').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
});

// reference to sport
export const sportMode = pgTable('sport_mode', {
  id: uuid('uuid').primaryKey().defaultRandom(),
  // deleting the sport will delete the modes.
  sportId: uuid('sport_id')
    .notNull()
    .references(() => sport.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  teamSize: smallint('team_size').notNull(),
  // totalPlayers: smallint('total_players').notNull(),
});

export const sportRelations = relations(sport, ({ many }) => ({
  modes: many(sportMode),
}));

export const modeRelations = relations(sportMode, ({ one }) => ({
  sport: one(sport, {
    fields: [sportMode.sportId],
    references: [sport.id],
  }),
}));

//github.com/drizzle-team/drizzle-orm/discussions/1914
export const categoryEnum = pgEnum('categoryEnum', [
  'Amateur',
  'Professional',
  'Semi-Professional',
  'Casual',
  'Training',
  //Tournament-Match maybe we can link it when we create a tournament.
]);

const statusResponseEnum = [
  'accepted',
  'rejected',
  'pending',
  'absent',
  'waitingList',
] as const;

export type StatusResponse = (typeof statusResponseEnum)[number];

export const invitationStatusEnum = pgEnum(
  'invitationStatus',
  statusResponseEnum,
);

export const match = pgTable('match', {
  id: uuid('match_id').primaryKey().defaultRandom(),
  sportId: uuid('sport_id')
    .notNull()
    .references(() => sport.id),
  sportModeId: uuid('category_id')
    .notNull()
    .references(() => sportMode.id),
  category: categoryEnum('category').notNull(),
  date: timestamp('date').notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  createAt: timestamp('created_at').notNull().defaultNow(),
  description: text('description').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.externalId, { onDelete: 'cascade' }),
  isReserved: boolean('is_reserved').notNull().default(false),
  isPublic: boolean('is_public').notNull().default(true),
  allowWaitList: boolean('allow_wait_list').notNull().default(false),
  observations: text('observations'),
  ended: boolean('ended').notNull().default(false),
});

// we gonna a reference table of the users and the match
// could a request to join the match or be invited
export const matchPlayers = pgTable(
  'match_players',
  {
    matchPlayerId: uuid('match_player_id').primaryKey().defaultRandom(),
    matchId: uuid('match_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.externalId),
    isOwner: boolean('is_owner').notNull().default(false),
    isInvited: boolean('is_invited').notNull().default(false),
    isRequested: boolean('is_requested').notNull().default(false),
    invitationStatus: invitationStatusEnum('invitationStatus').notNull(),
  },
  (t) => ({
    unq: unique().on(t.matchId, t.userId),
  }),
);

export const matchPlayersRelations = relations(matchPlayers, ({ one }) => ({
  match: one(match, {
    fields: [matchPlayers.matchId],
    references: [match.id],
  }),
  user: one(user, {
    fields: [matchPlayers.userId],
    references: [user.externalId],
  }),
}));

export const matchRelations = relations(match, ({ many, one }) => ({
  players: many(matchPlayers),
  sport: one(sport, {
    fields: [match.sportId],
    references: [sport.id],
  }),
  mode: one(sportMode, {
    fields: [match.sportModeId],
    references: [sportMode.id],
  }),
  owner: one(user, {
    fields: [match.ownerId],
    references: [user.externalId],
  }),
}));

export const user = pgTable('user_profile', {
  id: uuid('uuid').primaryKey().defaultRandom(),
  externalId: text('external_id').notNull().unique(),
  nationality: text('text'), // Could be picked by a dropdown list. COuld work when fllter matches maybe the owner (If this application works in different countries).

  // interestSports: [sportId]
  // profilePicture
  // location like lat and long doub
});

export const userRelations = relations(user, ({ many }) => ({
  matches: many(match),
  teams: many(team),
}));

export const team = pgTable('team', {
  id: uuid('uuid').primaryKey().defaultRandom(),
  name: text('text').notNull(),
  // sportId: uuid('uuid').notNull(),
  // categoryId: uuid('uuid').notNull(),
  // userId: uuid('uuid').notNull(), [list of teamMembers]
});

// export const tournaments = pgTable('tournament', {
//   id: uuid('uuid').primaryKey().defaultRandom(),
//   name: text('text').notNull(),
//   // description:
//   // sportId: uuid('uuid').notNull(),
//   // categoryId: uuid('uuid').notNull(),
//   // userId: uuid('uuid').notNull(), [list of teamMembers]
// });
