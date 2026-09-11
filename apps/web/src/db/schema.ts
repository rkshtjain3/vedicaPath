import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const birthProfiles = sqliteTable('birth_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  fullName: text('full_name'),
  dateOfBirth: text('date_of_birth').notNull(), // YYYY-MM-DD
  timeOfBirth: text('time_of_birth').notNull(), // HH:mm or HH:mm:ss
  timezone: text('timezone').notNull(), // e.g. Asia/Kolkata
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  locationName: text('location_name').notNull(),
  calculationProfileVersion: text('calculation_profile_version').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});


export type BirthProfileSelect = typeof birthProfiles.$inferSelect;
export type BirthProfileInsert = typeof birthProfiles.$inferInsert;
