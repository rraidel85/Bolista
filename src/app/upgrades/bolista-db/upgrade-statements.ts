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
          pick3 integer NOT NULL default 0,
          pick4 integer NOT NULL default 0,
          limitado integer NOT NULL default 0,
          centena integer NOT NULL default 0,
          parle integer NOT NULL default 0,
          candado integer NOT NULL default 0,
          centena_c integer NOT NULL default 0,
          tema varchar NOT NULL default "light"
        );`,
      `insert into config (pick3,pick4,limitado,centena,parle,candado,centena_c) 
      values (0,0,0,0,0,0,0);`,
      
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
  },
  {
    toVersion: 4,
    statements: [
      `CREATE TABLE IF NOT EXISTS sms (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        sms_id integer NOT NULL UNIQUE,
        body varchar NOT NULL UNIQUE,
        time_stamps varchar NOT NULL UNIQUE,
        edited integer NOT NULL default 0,
        saved integer NOT NULL default 0
      );`,
      `INSERT INTO pases (pase,pase_plus) VALUES (0,0)`
    ]
  },
  {
    toVersion: 5,
    statements: [
      `CREATE TABLE IF NOT EXISTS trial (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        tries integer NOT NULL
      );`,
      `INSERT INTO trial (tries) VALUES (0)`
    ]
  }
];
