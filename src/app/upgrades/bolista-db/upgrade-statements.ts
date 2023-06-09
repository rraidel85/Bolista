export const bolistaDbVersionUpgrades = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS list_elements (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          pick varchar(20) NOT NULL UNIQUE,
          price integer NOT NULL,
          amount integer NOT NULL,
          corrido integer,
          pase integer,
          grupo integer
        );`
    ]
  }
];
