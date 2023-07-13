export const bolistaDbVersionUpgrades = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS list_elements (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          pick varchar(20) NOT NULL,
          price integer NOT NULL,
          amount integer NOT NULL,
          grupo integer NOT NULL,
          corrido integer,
          pase integer
        );`,
    ],
  },
  {
    toVersion: 2,
    statements: [
      `CREATE TABLE IF NOT EXISTS limits (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          pick varchar(20) NOT NULL,
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
    ],
  },
  {
    toVersion: 3,
    statements: [
      `CREATE TABLE IF NOT EXISTS pases (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        pase integer default 0,
        pase_plus integer default 0
      );`,
      `INSERT INTO pases (pase,pase_plus) VALUES (0,0)`,
    ],
  },
  {
    toVersion: 4,
    statements: [
      `CREATE TABLE IF NOT EXISTS sms (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        sms_id integer NOT NULL UNIQUE,
        body varchar NOT NULL,
        timestamp varchar NOT NULL UNIQUE
      );`,
      `INSERT INTO pases (pase,pase_plus) VALUES (0,0)`,
    ],
  },
  {
    toVersion: 5,
    statements: [
      `CREATE TABLE IF NOT EXISTS trial (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        active integer NOT NULL
      );`,
      `INSERT INTO trial (active) VALUES (0)`,
    ],
  },
  {
    toVersion: 6,
    statements: [
      `CREATE TABLE IF NOT EXISTS ganadores (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        pick3 varchar NOT NULL,
        pick41 varchar NOT NULL,
        pick42 varchar NOT NULL
      );`,
      `INSERT INTO ganadores (pick3,pick41,pick42) VALUES ('0','0','0')`,
      `CREATE TABLE IF NOT EXISTS premios (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        pick varchar NOT NULL,
        price varchar NOT NULL,
        pago varchar NOT NULL,
        a_pagar varchar NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS contactos (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        contactId int NOT NULL,
        name varchar NOT NULL,
        phones varchar NOT NULL
      );`,
    ],
  },
];
