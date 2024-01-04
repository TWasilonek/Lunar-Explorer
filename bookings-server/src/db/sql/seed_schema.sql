CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS public.room_occupancies CASCADE;
DROP TABLE IF EXISTS public.flight_occupancies CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.flights CASCADE;
DROP TABLE IF EXISTS public.spaceships CASCADE;
DROP TABLE IF EXISTS public.manufacturers CASCADE;
DROP TABLE IF EXISTS public.ports CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS public.users_role_enum;
CREATE TYPE public.users_role_enum AS ENUM ('admin', 'user');
CREATE TABLE IF NOT EXISTS public.bookings (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "bookingNumber" character varying(10) NOT NULL,
    status character varying(20) NOT NULL,
    "numberOfGuests" integer NOT NULL,
    "userId" uuid,
    "guestNames" text [] NOT NULL,
    "tripId" integer
);
CREATE TABLE public.flight_occupancies (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    "bookingId" uuid,
    "seatNumber" character varying(3) NOT NULL,
    "flightId" integer
);
CREATE TABLE public.flights (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    "flightNumber" character varying(8) NOT NULL,
    "departureTime" timestamp with time zone NOT NULL,
    "arrivalTime" timestamp with time zone NOT NULL,
    status character varying(20) NOT NULL,
    "spaceshipId" integer,
    "originPortId" integer,
    "destinationPortId" integer
);
CREATE TABLE public.manufacturers (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL
);
CREATE TABLE public.payments (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    amount numeric(12, 2) NOT NULL,
    "paymentMethod" character varying(50) NOT NULL,
    "paymentDate" timestamp with time zone DEFAULT now() NOT NULL,
    "bookingIdId" uuid,
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY
);
CREATE TABLE public.ports (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    code character varying(20) NOT NULL,
    location character varying(255) NOT NULL
);
CREATE TABLE public.room_occupancies (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    "numberOfOccupants" integer NOT NULL,
    "roomId" integer,
    "bookingId" uuid,
    "tripId" integer
);
CREATE TABLE public.rooms (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    "roomNumber" character varying(3) NOT NULL,
    capacity integer NOT NULL,
    "mainPhotoUrl" character varying(255) NOT NULL
);
CREATE TABLE public.spaceships (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    model character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    "totalSeats" integer NOT NULL,
    "manufacturerId" integer
);
CREATE TABLE public.trips (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id SERIAL PRIMARY KEY,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    status character varying(20) NOT NULL,
    capacity integer NOT NULL,
    occupancy integer NOT NULL,
    "flightToMoonId" integer,
    "flightToEarthId" integer
);
CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(100) NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    "refreshToken" VARCHAR(255) UNIQUE,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
-- ALTER TABLE ONLY public.rooms
-- ADD CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.manufacturers
-- ADD CONSTRAINT "PK_138520de32c379a48e703441975" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.payments
-- ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.ports
-- ADD CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.spaceships
-- ADD CONSTRAINT "PK_77be88e73cae962e8f3e6b2f764" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.room_occupancies
-- ADD CONSTRAINT "PK_95d751bf71408ed6d7c83e0496a" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.users
-- ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.bookings
-- ADD CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.flights
-- ADD CONSTRAINT "PK_c614ef3382fdd70b6d6c2c8d8dd" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.flight_occupancies
-- ADD CONSTRAINT "PK_d9580d00c6d2eb79b1edad4a8bc" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.trips
-- ADD CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY (id);
-- ALTER TABLE ONLY public.room_occupancies
-- ADD CONSTRAINT "REL_9a9b8a16c2e0247593e6344bd4" UNIQUE ("roomId");
ALTER TABLE ONLY public.trips
ADD CONSTRAINT "UQ_04a17ecded4b2f23fc9f5596ed8" UNIQUE ("flightToEarthId");
ALTER TABLE ONLY public.trips
ADD CONSTRAINT "UQ_9c641664f3c491ed2fb4d1a8954" UNIQUE ("flightToMoonId");
ALTER TABLE ONLY public.users
ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);
ALTER TABLE ONLY public.trips
ADD CONSTRAINT "FK_04a17ecded4b2f23fc9f5596ed8" FOREIGN KEY ("flightToEarthId") REFERENCES public.flights(id);
ALTER TABLE ONLY public.bookings
ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE
SET NULL;
ALTER TABLE ONLY public.flight_occupancies
ADD CONSTRAINT "FK_458734affab1e73da56b1b898dc" FOREIGN KEY ("bookingId") REFERENCES public.bookings(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.flights
ADD CONSTRAINT "FK_4ec73049aec5f34711da17ddc14" FOREIGN KEY ("destinationPortId") REFERENCES public.ports(id);
ALTER TABLE ONLY public.payments
ADD CONSTRAINT "FK_51b64124038b8997e59bfef6d6d" FOREIGN KEY ("bookingIdId") REFERENCES public.bookings(id);
ALTER TABLE ONLY public.flights
ADD CONSTRAINT "FK_563bc953fa8f3ae145c63814db5" FOREIGN KEY ("spaceshipId") REFERENCES public.spaceships(id);
ALTER TABLE ONLY public.flights
ADD CONSTRAINT "FK_57e840443eaf9124a09ed077de8" FOREIGN KEY ("originPortId") REFERENCES public.ports(id);
ALTER TABLE ONLY public.flight_occupancies
ADD CONSTRAINT "FK_8ed98633b282dd8583d79fff63c" FOREIGN KEY ("flightId") REFERENCES public.flights(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.room_occupancies
ADD CONSTRAINT "FK_906f7ae28551370adf7dc6dfdfb" FOREIGN KEY ("bookingId") REFERENCES public.bookings(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.room_occupancies
ADD CONSTRAINT "FK_9a9b8a16c2e0247593e6344bd4a" FOREIGN KEY ("roomId") REFERENCES public.rooms(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.trips
ADD CONSTRAINT "FK_9c641664f3c491ed2fb4d1a8954" FOREIGN KEY ("flightToMoonId") REFERENCES public.flights(id);
ALTER TABLE ONLY public.room_occupancies
ADD CONSTRAINT "FK_c2d7a8f925dc5b5c295b08923ef" FOREIGN KEY ("tripId") REFERENCES public.trips(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.bookings
ADD CONSTRAINT "FK_e33f0b046a54956d011b3d377ef" FOREIGN KEY ("tripId") REFERENCES public.trips(id);
ALTER TABLE ONLY public.spaceships
ADD CONSTRAINT "FK_e6c23ae7b092bbd0d2f0e4f40e1" FOREIGN KEY ("manufacturerId") REFERENCES public.manufacturers(id) ON DELETE
SET NULL;
-- Reset the sequence in all tables
DO $$
DECLARE i TEXT;
BEGIN FOR i IN (
    SELECT tb.table_name
    FROM information_schema.tables AS tb
        INNER JOIN information_schema.columns AS cols ON tb.table_name = cols.table_name
    WHERE tb.table_catalog = 'DATA_BASE_NAME'
        AND tb.table_schema = 'public'
        AND cols.column_name = 'id'
) LOOP EXECUTE 'SELECT setval(' || '"' || i || '_Id_seq"' || ',1);';
END LOOP;
END $$;