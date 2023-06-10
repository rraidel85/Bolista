export const bolistaDbVersionUpgrades = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS list_elements (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          pick varchar(20) NOT NULL UNIQUE,
          price integer NOT NULL,
          amount integer NOT NULL,
          grupo integer NOT NULL,
          corrido integer,
          pase integer
        );`
    ]
  },
  {
    toVersion: 2,
    statements: [
      `CREATE TABLE IF NOT EXISTS limits (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          pick varchar(20) NOT NULL UNIQUE,
          grupo integer NOT NULL
        );`,
      `CREATE TABLE IF NOT EXISTS config (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          pick3 integer NOT NULL UNIQUE,
          pick4 integer NOT NULL UNIQUE,
          limitado integer NOT NULL UNIQUE,
          centena integer NOT NULL UNIQUE,
          parle integer NOT NULL UNIQUE,
          candado integer NOT NULL UNIQUE,
          centena_c integer NOT NULL UNIQUE
        );`,
      
    ]
  },
  {
    toVersion: 3,
    statements: [
      `CREATE TABLE IF NOT EXISTS pases (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        pase integer default 0,
        pase_plus integer default 0
      );`,
      `INSERT INTO pases (pase,pase_plus) VALUES (0,0)`
    ]
  }
];
