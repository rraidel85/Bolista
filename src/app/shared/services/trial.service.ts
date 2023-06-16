import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError, timer } from 'rxjs';
import { mergeMap, retry } from 'rxjs/operators';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrialService {
  private maxTries = environment.maxTries;
  private tries!: number;
  constructor(private http: HttpClient, private dbService: BolistaDbService) {
    this.dbService.mDb.query(`select tries from trial`).then((ret) => {
      this.tries = ret.values![0].tries;
    });
  }

  onTrial(): Observable<any> {
    const intervalTime = environment.intervalTime;

    return timer(0, intervalTime) // Intervalo de 1 segundo (puedes ajustarlo según tus necesidades)
      .pipe(
        mergeMap(() => this.http.get(environment.trialUrl)),

        /* catchError((error) => {
          //
          if (this.maxTries < this.tries) {
            return of({ timeout: true });
          } else {
            this.tries++;
            this.dbService.mDb.execute(`update trial set tries=${this.tries}`);
            return throwError(() => new Error());
          }
        }), */
        retry({ delay: intervalTime })
        // map((respuesta: any) => respuesta.trial)
      );
  }
}
