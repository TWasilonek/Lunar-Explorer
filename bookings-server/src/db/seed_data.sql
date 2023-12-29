INSERT INTO ports (id, name, code, location)
VALUES 
  (1, 'Cape Canaveral Space Force Station', 'CCSFS', 'Cape Canaveral, Florida, USA'),
  (2, 'Vandenberg Space Force Base', 'VBG', 'Lompoc, Santa Barbara County, California, USA'),
  (3, 'Kennedy Space Center', 'KSC', 'Merritt Island, Brevard County, Florida, USA'),
  (4, 'International Space Station', 'ISS', 'Low Earth Orbit'),
  (5, 'Lunar Spaceport', 'LSP', 'Moon');
SELECT setval('ports_id_seq', (SELECT MAX(id) FROM ports));

INSERT INTO manufacturers (id, name)
VALUES 
  (1, 'SpaceX'),
  (2, 'The Spaceship Company'),
  (3, 'Lunar Space Systems');
SELECT setval('manufacturers_id_seq', (SELECT MAX(id) FROM manufacturers));


INSERT INTO spaceships (id, model, name, "totalSeats", "manufacturerId")
VALUES 
  (1, 'Lunar Starship (LS)', 'Voyager 1', 10, 3),
  (2, 'Lunar Starship (LS)', 'Voyager 2', 10, 3),
  (3, 'Lunar Starship (LS)', 'Voyager 3', 10, 3),
  (4, 'Lunar Starship (LS)', 'Voyager 4', 10, 3),
  (5, 'Starship', 'Ego I', 15, 1),
  (6, 'Starship', 'Ego X100', 15, 1);
SELECT setval('spaceships_id_seq', (SELECT MAX(id) FROM spaceships));

INSERT INTO users (id, "firstName", "lastName", email, password, role)
VALUES
  ('7bd107d9-1eeb-4da1-8be3-7c2d5c5db212', 'Admin', 'Admin', 'admin@admin.pl', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'admin'),
  ('c96f2636-c47e-4840-b844-f08e39a5599b', 'John', 'Doe', 'John@Doe.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('c3451038-cf72-4f56-be1f-4f39f736c307', 'Eloneusz', 'Muskinski', 'ego@elo.dev', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('5d5c1d70-244c-4a12-8890-0494378c0f3f', 'Alice', 'Johnson', 'alice.johnson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('a2b36b6d-b829-4c3d-9c87-5bc19bf9a7e0', 'Robert', 'Smith', 'robert.smith@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('9a1d5c56-1ff5-4eac-bf47-2586a2a1a395', 'Emily', 'White', 'emily.white@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('7cf5237c-0c97-4a6f-8ec7-8f822e5cb1c6', 'Michael', 'Davis', 'michael.davis@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('f6e2a0c1-c8b5-4d6a-b3b5-39ecf02c0a65', 'Sarah', 'Brown', 'sarah.brown@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('d2a54043-3e2a-4a2c-9ba2-bb942881ab2d', 'Daniel', 'Anderson', 'daniel.anderson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('48c3a0a9-82eb-43aa-b535-2a2253a24319', 'Olivia', 'Miller', 'olivia.miller@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('0cb93df8-9615-44fe-8c95-303292ef9a79', 'James', 'Taylor', 'james.taylor@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('b35d2682-53cf-49e1-9e47-29e1b6d3e0d1', 'Sophia', 'Moore', 'sophia.moore@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('8b39c39d-c04a-4b9b-86f1-2765d84a9e4e', 'Ethan', 'Wilson', 'ethan.wilson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('bba8f46b-6f46-4ff2-a1f4-1b3c5822ac92', 'Emma', 'Robinson', 'emma.robinson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('2dcb6e41-7809-4ee3-9cc5-4ff1047e25dd', 'William', 'Martinez', 'william.martinez@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('e1a99c49-7ea5-4f4d-815e-7b10164c14d3', 'Chloe', 'Garcia', 'chloe.garcia@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('7b512c43-0fcf-4a44-8f90-1a650ed8c70c', 'Benjamin', 'Adams', 'benjamin.adams@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('d6087d3d-3e4e-4b17-9294-ec2f77899aa5', 'Mia', 'Cooper', 'mia.cooper@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('5a9d45a8-e2cc-4e3e-9cda-6357fb4d7aa0', 'Liam', 'Turner', 'liam.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('c80fe5aa-5010-4a5b-bc32-81116191bbd1', 'Harper', 'Hill', 'harper.hill@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('03c7478d-d939-4f4e-bf0c-0a73344a55ec', 'Jackson', 'Mitchell', 'jackson.mitchell@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('9015d76e-7ff9-4f92-9d6b-829eb2fb67e7', 'Lily', 'Cooper', 'lily.cooper@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('09c24288-3b86-4e0b-a268-7d5b7de6d34e', 'Aiden', 'Jenkins', 'aiden.jenkins@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('7ac98d2b-6a09-4f8d-aaf7-74e4e2b5c71c', 'Sophia', 'Turner', 'sophia.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('0eb410b4-238b-4db4-910e-6dbad7fda5a5', 'Noah', 'Lewis', 'noah.lewis@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('2f56ab4b-7a94-4b72-b6e8-6f4a40f21764', 'Ava', 'Parker', 'ava.parker@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('8c6ff8b8-df6f-4a48-8a27-9e9b9a2c7874', 'James', 'Adams', 'james.adams@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('67cd88a1-190f-4d67-aa24-44c6b671f1e4', 'Olivia', 'Green', 'olivia.green@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('4a2a0b8f-c5c1-4c65-9abf-12d8a3d46e2b', 'Jackson', 'Moore', 'jackson.moore@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('689b5bd1-70ac-4b07-8c2e-77ef7859d8b3', 'Emma', 'Turner', 'emma.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('8cfb4f4f-c6d5-4e7e-835b-b6bf31c9acfd', 'Aiden', 'Walker', 'aiden.walker@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('4d7f4702-7a97-40c4-9f96-d276763c1dcd', 'Lily', 'Wright', 'lily.wright@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('6a1966a3-7d9c-4d6a-bde1-5f6bc9ed9a4a', 'Ethan', 'Parker', 'ethan.parker@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('3b2ea987-8af4-465b-8f9f-7a6abade5d72', 'Grace', 'Miller', 'grace.miller@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('0e95b4b2-3b50-4645-bd94-2c9f3bf89c7a', 'Oliver', 'Adams', 'oliver.adams@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('6b82d660-92fb-42e8-b1f2-3f9f14c90721', 'Scarlett', 'Turner', 'scarlett.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('895d0f21-3e1b-4e67-9f3e-6a4b8f24c8f7', 'Mason', 'Moore', 'mason.moore@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('0d937c43-6ea5-40a8-9bda-0c0f0a7f8f2b', 'Ava', 'Martin', 'ava.martin@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('59e5c5a4-345e-4d35-8d6f-0b307df5367e', 'Liam', 'Davis', 'liam.davis@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('96c3f89e-89e9-4c32-93b3-1bdaad2c44fc', 'Zoey', 'Wilson', 'zoey.wilson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('0ce15b50-0d95-4da8-9a93-d8b650ea6a26', 'William', 'Turner', 'william.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('899ab661-4f65-48a1-8d04-63d92b64c272', 'Harper', 'Wilson', 'harper.wilson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('ceb6a198-97a1-4c6d-8b25-6c6d52a3b12b', 'Noah', 'Taylor', 'noah.taylor@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('21c43cf1-5b6b-4e8a-a1ec-36bae59b0ff9', 'Emma', 'Green', 'emma.green@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('8725e2c2-930d-4b4d-a7b8-63b764db0945', 'Logan', 'Adams', 'logan.adams@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('aea84ac4-62dd-4592-8759-aae7a064f6cf', 'Mia', 'Taylor', 'mia.taylor@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('f6a4e5f5-0a5a-4f89-9ef3-c3d37f6b0f07', 'Elijah', 'Davis', 'elijah.davis@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('9a6b7e3b-22f4-45ce-b76c-2f2ea3ef9d5e', 'Ava', 'Wright', 'ava.wright@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('88a4dcd2-1c77-4efb-a2f1-64f6ff1d5df1', 'William', 'White', 'william.white@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('1ac86833-6d43-4f56-92b9-d6a0a2a617d2', 'Mia', 'Robinson', 'mia.robinson@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('388fc630-4900-4b53-8f7d-d3df929fd2fc', 'Oliver', 'Turner', 'oliver.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('a84e0ba7-2d0f-495d-b437-186a453a697d', 'Scarlett', 'Harris', 'scarlett.harris@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user'),
  ('a9e0a6bc-9eb1-47d0-8e0e-7e937a98eef2', 'Mason', 'Turner', 'mason.turner@email.com', '$2a$08$aiTN7VkQ2J/OrE/QV3cB8uWpab3UI.9jVTpS1BdtCtzDUbjzqxF96', 'user');

INSERT INTO flights (id, "flightNumber", "departureTime", "arrivalTime", "spaceshipId", "originPortId", "destinationPortId", status)
VALUES
  (1, 'LE 1', '2024-03-01 12:00:00 EST'::timestamptz, '2024-03-01 22:00:00 PST'::timestamptz, 1, 1, 5, 'scheduled'),
  (2, 'LE 2', '2024-03-07 12:00:00 PST'::timestamptz, '2024-03-07 22:00:00 EST'::timestamptz, 1, 5, 1, 'scheduled'),
  (3, 'SX 1', '2024-03-08 12:00:00 EST'::timestamptz, '2024-03-08 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (4, 'SX 2', '2024-03-15 12:00:00 PST'::timestamptz, '2024-03-15 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (5, 'LE 1', '2024-03-16 12:00:00 EST'::timestamptz, '2024-03-16 22:00:00 PST'::timestamptz, 2, 1, 5, 'scheduled'),
  (6, 'LE 2', '2024-03-22 12:00:00 PST'::timestamptz, '2024-03-22 22:00:00 EST'::timestamptz, 2, 5, 1, 'scheduled'),
  (7, 'SX 1', '2024-03-23 12:00:00 EST'::timestamptz, '2024-03-23 22:00:00 PST'::timestamptz, 6, 2, 5, 'scheduled'),
  (8, 'SX 2', '2024-03-30 12:00:00 PST'::timestamptz, '2024-03-30 22:00:00 EST'::timestamptz, 6, 5, 2, 'scheduled'),
  (9, 'LE 1', '2024-03-31 12:00:00 EST'::timestamptz, '2024-03-31 22:00:00 PST'::timestamptz, 3, 1, 5, 'scheduled'),
  (10, 'LE 2', '2024-04-06 12:00:00 PST'::timestamptz, '2024-04-06 22:00:00 EST'::timestamptz, 3, 5, 1, 'scheduled'),
  (11, 'SX 1', '2024-04-13 12:00:00 EST'::timestamptz, '2024-04-13 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (12, 'SX 2', '2024-04-20 12:00:00 PST'::timestamptz, '2024-04-20 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (13, 'LE 1', '2024-04-21 12:00:00 EST'::timestamptz, '2024-04-21 22:00:00 PST'::timestamptz, 4, 1, 5, 'scheduled'),
  (14, 'LE 2', '2024-04-27 12:00:00 PST'::timestamptz, '2024-04-27 22:00:00 EST'::timestamptz, 4, 5, 1, 'scheduled'),
  (15, 'SX 1', '2024-05-04 12:00:00 EST'::timestamptz, '2024-05-04 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (16, 'SX 2', '2024-05-11 12:00:00 PST'::timestamptz, '2024-05-11 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (17, 'LE 1', '2024-05-12 12:00:00 EST'::timestamptz, '2024-05-12 22:00:00 PST'::timestamptz, 2, 1, 5, 'scheduled'),
  (18, 'LE 2', '2024-05-18 12:00:00 PST'::timestamptz, '2024-05-18 22:00:00 EST'::timestamptz, 2, 5, 1, 'scheduled'),
  (19, 'SX 1', '2024-05-25 12:00:00 EST'::timestamptz, '2024-05-25 22:00:00 PST'::timestamptz, 6, 2, 5, 'scheduled'),
  (20, 'SX 2', '2024-06-01 12:00:00 PST'::timestamptz, '2024-06-01 22:00:00 EST'::timestamptz, 6, 5, 2, 'scheduled'),
  (21, 'LE 1', '2024-06-02 12:00:00 EST'::timestamptz, '2024-06-02 22:00:00 PST'::timestamptz, 3, 1, 5, 'scheduled'),
  (22, 'LE 2', '2024-06-08 12:00:00 PST'::timestamptz, '2024-06-08 22:00:00 EST'::timestamptz, 3, 5, 1, 'scheduled'),
  (23, 'SX 1', '2024-06-15 12:00:00 EST'::timestamptz, '2024-06-15 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (24, 'SX 2', '2024-06-22 12:00:00 PST'::timestamptz, '2024-06-22 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (25, 'LE 1', '2024-06-29 12:00:00 EST'::timestamptz, '2024-06-29 22:00:00 PST'::timestamptz, 4, 1, 5, 'scheduled'),
  (26, 'LE 2', '2024-07-05 12:00:00 PST'::timestamptz, '2024-07-05 22:00:00 EST'::timestamptz, 4, 5, 1, 'scheduled'),
  (27, 'SX 1', '2024-07-06 12:00:00 EST'::timestamptz, '2024-07-06 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (28, 'SX 2', '2024-07-13 12:00:00 PST'::timestamptz, '2024-07-13 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (29, 'LE 1', '2024-07-20 12:00:00 EST'::timestamptz, '2024-07-20 22:00:00 PST'::timestamptz, 2, 1, 5, 'scheduled'),
  (30, 'LE 2', '2024-07-26 12:00:00 PST'::timestamptz, '2024-07-26 22:00:00 EST'::timestamptz, 2, 5, 1, 'scheduled'),
  (31, 'SX 1', '2024-07-27 12:00:00 EST'::timestamptz, '2024-07-27 22:00:00 PST'::timestamptz, 6, 2, 5, 'scheduled'),
  (32, 'SX 2', '2024-08-03 12:00:00 PST'::timestamptz, '2024-08-03 22:00:00 EST'::timestamptz, 6, 5, 2, 'scheduled'),
  (33, 'LE 1', '2024-08-10 12:00:00 EST'::timestamptz, '2024-08-10 22:00:00 PST'::timestamptz, 3, 1, 5, 'scheduled'),
  (34, 'LE 2', '2024-08-16 12:00:00 PST'::timestamptz, '2024-08-16 22:00:00 EST'::timestamptz, 3, 5, 1, 'scheduled'),
  (35, 'SX 1', '2024-08-17 12:00:00 EST'::timestamptz, '2024-08-17 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (36, 'SX 2', '2024-08-24 12:00:00 PST'::timestamptz, '2024-08-24 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (37, 'LE 1', '2024-08-31 12:00:00 EST'::timestamptz, '2024-08-31 22:00:00 PST'::timestamptz, 4, 1, 5, 'scheduled'),
  (38, 'LE 2', '2024-09-06 12:00:00 PST'::timestamptz, '2024-09-06 22:00:00 EST'::timestamptz, 4, 5, 1, 'scheduled'),
  (39, 'SX 1', '2024-09-07 12:00:00 EST'::timestamptz, '2024-09-07 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (40, 'SX 2', '2024-09-14 12:00:00 PST'::timestamptz, '2024-09-14 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (41, 'LE 1', '2024-09-21 12:00:00 EST'::timestamptz, '2024-09-21 22:00:00 PST'::timestamptz, 2, 1, 5, 'scheduled'),
  (42, 'LE 2', '2024-09-27 12:00:00 PST'::timestamptz, '2024-09-27 22:00:00 EST'::timestamptz, 2, 5, 1, 'scheduled'),
  (43, 'SX 1', '2024-09-28 12:00:00 EST'::timestamptz, '2024-09-28 22:00:00 PST'::timestamptz, 6, 2, 5, 'scheduled'),
  (44, 'SX 2', '2024-10-05 12:00:00 PST'::timestamptz, '2024-10-05 22:00:00 EST'::timestamptz, 6, 5, 2, 'scheduled'),
  (45, 'LE 1', '2024-10-12 12:00:00 EST'::timestamptz, '2024-10-12 22:00:00 PST'::timestamptz, 3, 1, 5, 'scheduled'),
  (46, 'LE 2', '2024-10-18 12:00:00 PST'::timestamptz, '2024-10-18 22:00:00 EST'::timestamptz, 3, 5, 1, 'scheduled'),
  (47, 'SX 1', '2024-10-19 12:00:00 EST'::timestamptz, '2024-10-19 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (48, 'SX 2', '2024-10-26 12:00:00 PST'::timestamptz, '2024-10-26 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (49, 'LE 1', '2024-11-02 12:00:00 EST'::timestamptz, '2024-11-02 22:00:00 PST'::timestamptz, 4, 1, 5, 'scheduled'),
  (50, 'LE 2', '2024-11-08 12:00:00 PST'::timestamptz, '2024-11-08 22:00:00 EST'::timestamptz, 4, 5, 1, 'scheduled'),
  (51, 'SX 1', '2024-11-09 12:00:00 EST'::timestamptz, '2024-11-09 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (52, 'SX 2', '2024-11-16 12:00:00 PST'::timestamptz, '2024-11-16 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled'),
  (53, 'LE 1', '2024-11-23 12:00:00 EST'::timestamptz, '2024-11-23 22:00:00 PST'::timestamptz, 2, 1, 5, 'scheduled'),
  (54, 'LE 2', '2024-11-29 12:00:00 PST'::timestamptz, '2024-11-29 22:00:00 EST'::timestamptz, 2, 5, 1, 'scheduled'),
  (55, 'SX 1', '2024-11-30 12:00:00 EST'::timestamptz, '2024-11-30 22:00:00 PST'::timestamptz, 6, 2, 5, 'scheduled'),
  (56, 'SX 2', '2024-12-07 12:00:00 PST'::timestamptz, '2024-12-07 22:00:00 EST'::timestamptz, 6, 5, 1, 'scheduled'),
  (57, 'LE 1', '2024-12-14 12:00:00 EST'::timestamptz, '2024-12-14 22:00:00 PST'::timestamptz, 3, 1, 5, 'scheduled'),
  (58, 'LE 2', '2024-12-20 12:00:00 PST'::timestamptz, '2024-12-20 22:00:00 EST'::timestamptz, 3, 5, 1, 'scheduled'),
  (59, 'SX 1', '2024-12-21 12:00:00 EST'::timestamptz, '2024-12-21 22:00:00 PST'::timestamptz, 5, 2, 5, 'scheduled'),
  (60, 'SX 2', '2024-12-28 12:00:00 PST'::timestamptz, '2024-12-28 22:00:00 EST'::timestamptz, 5, 5, 2, 'scheduled');
SELECT setval('flights_id_seq', (SELECT MAX(id) FROM flights));

INSERT INTO trips (id, "startDate", "endDate", "flightToMoonId", "flightToEarthId", capacity, occupancy, status)
VALUES
  (1, '2024-03-01'::date, '2024-03-07'::date, 1, 2, 10, 3, 'scheduled'),
  (2, '2024-03-08'::date, '2024-03-15'::date, 3, 4, 15, 0, 'scheduled'),
  (3, '2024-03-16'::date, '2024-03-22'::date, 5, 6, 10, 0, 'scheduled'),
  (4, '2024-03-23'::date, '2024-03-30'::date, 7, 8, 15, 0, 'scheduled'),
  (5, '2024-03-31'::date, '2024-04-06'::date, 9, 10, 10, 0, 'scheduled'),
  (6, '2024-04-13'::date, '2024-04-20'::date, 11, 12, 15, 0, 'scheduled'),
  (7, '2024-04-21'::date, '2024-04-27'::date, 13, 14, 10, 0, 'scheduled'),
  (8, '2024-05-04'::date, '2024-05-11'::date, 15, 16, 15, 0, 'scheduled'),
  (9, '2024-05-12'::date, '2024-05-18'::date, 17, 18, 10, 0, 'scheduled'),
  (10, '2024-05-25'::date, '2024-06-01'::date, 19, 20, 15, 0, 'scheduled'),
  (11, '2024-06-02'::date, '2024-06-08'::date, 21, 22, 10, 0, 'scheduled'),
  (12, '2024-06-15'::date, '2024-06-22'::date, 23, 24, 15, 0, 'scheduled'),
  (13, '2024-06-29'::date, '2024-07-05'::date, 25, 26, 10, 0, 'scheduled'),
  (14, '2024-07-06'::date, '2024-07-13'::date, 27, 28, 15, 0, 'scheduled'),
  (15, '2024-07-20'::date, '2024-07-26'::date, 29, 30, 10, 0, 'scheduled'),
  (16, '2024-07-27'::date, '2024-08-03'::date, 31, 32, 15, 0, 'scheduled'),
  (17, '2024-08-10'::date, '2024-08-16'::date, 33, 34, 10, 0, 'scheduled'),
  (18, '2024-08-17'::date, '2024-08-24'::date, 35, 36, 15, 0, 'scheduled'),
  (19, '2024-08-31'::date, '2024-09-06'::date, 37, 38, 10, 0, 'scheduled'),
  (20, '2024-09-07'::date, '2024-09-14'::date, 39, 40, 15, 0, 'scheduled'),
  (21, '2024-09-21'::date, '2024-09-27'::date, 41, 42, 10, 0, 'scheduled'),
  (22, '2024-09-28'::date, '2024-10-05'::date, 43, 44, 15, 0, 'scheduled'),
  (23, '2024-10-12'::date, '2024-10-18'::date, 45, 46, 10, 0, 'scheduled'),
  (24, '2024-10-19'::date, '2024-10-26'::date, 47, 48, 15, 0, 'scheduled'),
  (25, '2024-11-02'::date, '2024-11-08'::date, 49, 50, 10, 0, 'scheduled'),
  (26, '2024-11-09'::date, '2024-11-16'::date, 51, 52, 15, 0, 'scheduled'),
  (27, '2024-11-23'::date, '2024-11-29'::date, 53, 54, 10, 0, 'scheduled'),
  (28, '2024-11-30'::date, '2024-12-07'::date, 55, 56, 15, 0, 'scheduled'),
  (29, '2024-12-14'::date, '2024-12-20'::date, 57, 58, 10, 0, 'scheduled'),
  (30, '2024-12-21'::date, '2024-12-28'::date, 59, 60, 15, 0, 'scheduled');
SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips));

INSERT INTO rooms (id, "roomNumber", capacity, "mainPhotoUrl")
VALUES
  (1, '001', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (2, '002', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (3, '003', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (4, '004', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (5, '005', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (6, '006', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (7, '007', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (8, '008', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (9, '009', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (10, '010', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (11, '011', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (12, '012', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (13, '013', 2, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (14, '014', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080'),
  (15, '015', 1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMTEzNDI2NQ&ixlib=rb-4.0.3&q=80&w=1080');
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));

INSERT INTO bookings (id, "bookingNumber", status, "numberOfGuests", "userId", "guestNames", "tripId")
VALUES
  ('f6a4e5f5-0a5a-4f89-9ef3-c3d37f6b0f07', '012345', 'pending_payment', 1, 'aea84ac4-62dd-4592-8759-aae7a064f6cf', '{"Mia Taylor"}', 1),
  ('9e8d79cd-83da-44a7-9f44-0c1433fbb365', '012346', 'pending_payment', 2, '0d937c43-6ea5-40a8-9bda-0c0f0a7f8f2b', '{"Logan Adams", "Gerry Adams"}', 1);

INSERT INTO room_occupancies (id, "numberOfOccupants", "roomId", "bookingId", "tripId")
VALUES
  (1, 1, 5, 'f6a4e5f5-0a5a-4f89-9ef3-c3d37f6b0f07', 1),
  (2, 2, 1, '9e8d79cd-83da-44a7-9f44-0c1433fbb365', 1);
SELECT setval('room_occupancies_id_seq', (SELECT MAX(id) FROM room_occupancies));

INSERT INTO flight_occupancies (id, "bookingId", "seatNumber", "flightId")
VALUES
  (1, 'f6a4e5f5-0a5a-4f89-9ef3-c3d37f6b0f07', '1', 1),
  (2, '9e8d79cd-83da-44a7-9f44-0c1433fbb365', '2', 1),
  (3, '9e8d79cd-83da-44a7-9f44-0c1433fbb365', '3', 1),
  (4, 'f6a4e5f5-0a5a-4f89-9ef3-c3d37f6b0f07', '1', 2),
  (5, '9e8d79cd-83da-44a7-9f44-0c1433fbb365', '2', 2),
  (6, '9e8d79cd-83da-44a7-9f44-0c1433fbb365', '3', 2);
SELECT setval('flight_occupancies_id_seq', (SELECT MAX(id) FROM flight_occupancies));