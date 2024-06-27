DO $$ BEGIN
 CREATE TYPE "public"."categoryEnum" AS ENUM('Amateur', 'Professional', 'Semi-Professional', 'Casual', 'Training');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invitationStatus" AS ENUM('accepted', 'rejected', 'pending', 'absent', 'waitingList');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match" (
	"match_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"category" "categoryEnum" NOT NULL,
	"date" timestamp NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"owner_id" text NOT NULL,
	"is_reserved" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"allow_wait_list" boolean DEFAULT false NOT NULL,
	"observations" text,
	"ended" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match_players" (
	"match_player_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	"is_invited" boolean DEFAULT false NOT NULL,
	"is_requested" boolean DEFAULT false NOT NULL,
	"invitationStatus" "invitationStatus" NOT NULL,
	CONSTRAINT "match_players_match_id_user_id_unique" UNIQUE("match_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sport" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "sport_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sport_mode" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_id" uuid NOT NULL,
	"name" text NOT NULL,
	"team_size" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profile" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"text" text,
	CONSTRAINT "user_profile_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_sport_id_sport_uuid_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sport"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_category_id_sport_mode_uuid_fk" FOREIGN KEY ("category_id") REFERENCES "public"."sport_mode"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_owner_id_user_profile_external_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profile"("external_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match_players" ADD CONSTRAINT "match_players_user_id_user_profile_external_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sport_mode" ADD CONSTRAINT "sport_mode_sport_id_sport_uuid_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sport"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
