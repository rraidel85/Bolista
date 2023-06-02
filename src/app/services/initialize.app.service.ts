import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
// import { AuthorPostsService } from './author-posts.service';
import { Toast } from '@capacitor/toast';
import { BolistaDbService } from './bolista-db.service';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    // private authorPostsService: AuthorPostsService,
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
        // Initialize the starter_posts database
        // await this.authorPostsService.initializeDatabase();
        // Initialize the starter_employees database
        await this.bolistaDbService.initializeDatabase();
        // Initialize any other database if any

        this.isAppInit = true;
        console.log('plugin started');
        

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
