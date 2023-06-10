import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { BolistaDbService } from './bolista-db.service';
import { ListElement } from '../models/list-element.model';

@Injectable()
export class ListElementsService {
  private tableName = 'list_elements';
  private fields: string[] = ['pick', 'price', 'amount', 'corrido', 'pase'];
  private mDb: SQLiteDBConnection;

  constructor(
    private sqliteService: SQLiteService,
    private bolistaDbService: BolistaDbService
  ) {
    this.mDb = this.bolistaDbService.mDb;
    
  }
  async create(listElement: ListElement) {
    try {
      await this.sqliteService.save(this.mDb, this.tableName, listElement);
    } catch (error) {
      console.log(error);
    }
  }
  async createMany(list: ListElement[], grupo: number) {
    try {
      const elements: ListElement[] = await this.getAll(grupo);
      const picks: string[] = elements.map((element) => {
        return element.pick;
      });
      let stmt = `INSERT INTO ${this.tableName} (pick,price,amount,grupo,corrido,pase ) VALUES `;

      let update = false;
      const values: string[] = [];
      list.forEach((element) => {
        if (!picks.includes(element.pick)) {
          let value = `('${element.pick}',${element.price},${element.amount},${grupo}`;
          if (element.corrido) {
            value = value + `,${element.corrido}`;
          } else {
            value = value + `,NULL`;
          }
          if (element.pase) {
            value = value + `,${element.pase}`;
          } else {
            value = value + `,NULL`;
          }
          value = value + ')';

          values.push(value);
        } else {
          update = true;
        }
      });
      if (update) {
        let uStmt = `UPDATE ${this.tableName} SET `;
        const updateValues = this.fields
          .map((field) => {
            if (this.fields[0] === field) return;
            let statement = `${field}= CASE ${this.fields[0]} `;
            const values: string[] = [];
            list.forEach((element) => {
              if (picks.includes(element.pick)) {
                if (element) {
                  if (typeof element[field as keyof ListElement] === 'number') {
                    
                    values.push(
                      `WHEN '${
                        element[this.fields[0] as keyof ListElement]
                      }' THEN ${field}+${element[field as keyof ListElement]}\n`
                    );
                  } else {
                    
                    values.push(
                      `WHEN '${
                        element[this.fields[0] as keyof ListElement]
                      }' THEN ${element[field as keyof ListElement]}\n`
                    );
                  }
                }
              }
            });

            statement = statement + values.join(' ') + ` ELSE ${field} END `;
            return statement;
          })
          .filter((x) => x !== undefined);
        uStmt += updateValues.join(',\n') + `WHERE grupo = ${grupo}`;
        await this.mDb.execute(uStmt);
      }
      if (values.length !== 0) {
        stmt += values.join(',');
        await this.mDb.execute(stmt);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getAll(
    grupo: number
    ): Promise<ListElement[]> {
    try {
      const elements: ListElement[] = (
        await this.mDb.query(
          `select * from ${this.tableName} WHERE grupo=${grupo}`
        )
      ).values as ListElement[];
      return elements;
      
    } catch (error) {
      console.log(error);
    }
    return []
  }

  async findOneById(id: number) {
    const element = (await this.sqliteService.findOneBy(
      this.mDb,
      this.tableName,
      { id }
    )) as ListElement;
    return element;
  }
  async update(id: number, listElement: ListElement) {
    await this.sqliteService.save(this.mDb, this.tableName, listElement, {
      id,
    });
    return await this.findOneById(id);
  }
  async delete(id: number): Promise<void> {
    await this.sqliteService.remove(this.mDb, this.tableName, {
      id,
    });
  }
}
