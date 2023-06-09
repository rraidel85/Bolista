import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { environment } from 'src/environments/environment';
import { bolistaDbVersionUpgrades } from '../upgrades/bolista-db/upgrade-statements';

@Injectable()
export class BolistaDbService {
  public databaseName: string;
  private versionUpgrades = bolistaDbVersionUpgrades;
  private loadToVersion =
    bolistaDbVersionUpgrades[bolistaDbVersionUpgrades.length - 1].toVersion;
  mDb!: SQLiteDBConnection;

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService
  ) {
    this.databaseName = environment.databaseName
  }

  async initializeDatabase() {
    // create upgrade statements
    await this.sqliteService.addUpgradeStatement({
      database: this.databaseName,
      upgrade: this.versionUpgrades,
    });
    // create and/or open the database
    await this.openDatabase();

    this.dbVerService.set(this.databaseName, this.loadToVersion);
    const isData = await this.mDb.query('select * from sqlite_sequence');
    console.log('tablas',(await this.mDb.getTableList()).values)
  }
  async openDatabase() {
    if (
      this.sqliteService.native &&
      (await this.sqliteService.isInConfigEncryption()).result &&
      (await this.sqliteService.isDatabaseEncrypted(this.databaseName)).result
    ) {
      this.mDb = await this.sqliteService.openDatabase(
        this.databaseName,
        true,
        'secret',
        this.loadToVersion,
        false
      );
    } else {
      this.mDb = await this.sqliteService.openDatabase(
        this.databaseName,
        false,
        'no-encryption',
        this.loadToVersion,
        false
      );
    }
  }
}