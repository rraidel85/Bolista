import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { Toast } from '@capacitor/toast';
import { BolistaDbService } from './bolista-db.service';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    private bolistaDbService: BolistaDbService
    ) {

  }

  async initializeApp() {
    await this.sqliteService.initializePlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;
      try {
        if( this.sqliteService.platform === 'web') {
          await this.sqliteService.initWebStore();
        }
        await this.bolistaDbService.initializeDatabase();

        this.isAppInit = true;
        

      } catch (error) {
        console.log(`initializeAppError: ${error}`);
        await Toast.show({
          text: `initializeAppError: ${error}`,
          duration: 'long'
        });
      }
    });
  }

}
