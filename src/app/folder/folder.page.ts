import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService } from '../shared/services/lists.service';
import { ListException } from '../shared/classes/list-exception.class';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private listsService: ListsService) { }

  ngOnInit() {
    //  let message: string = '3a5-444,3al43-666,11-4,22,23-3,123a423-2334,23al75-34,01-34,173-25,21-30,27-34-100c,7a72-1040,72,38,83,82,21,22,60,06,23-20,(23,34,12)-45,23con45-64234,00a99-16,70a79-100,08-100,00a99-50,01-300,01a91-50,77-100,62-30,60a69-5,00a99-5,33-10,66-5,16-5,10,19,07,72,45,70,69,71,17,06,65-10,89,62,34,33-5,98-20,60a69-6,33,82-50,00a99-20,62,08-20,'
     let message2: string = "01a99-123,69-20,51-20,91-50-20c,360-20,54con18-5,51con03-5,53con01-20,53con10-20,53-20-10c,52-5,41-10,17-5,90-5,89-5,16-20,19-20,10con35-10,10-5,01a91-5,20a29-10,20-100,27-50,40a49-30,289-20,"
    // let messages=[message,message2]
    //console.log(this.listsService.formatMessage());
    try {
      const picks = this.listsService.processMessage(message2);
      console.log(picks);
      
    } catch (error:any) {
      console.log(error.badBets);
      
    }
    
    
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
