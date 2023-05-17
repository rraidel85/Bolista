import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService } from '../shared/services/lists.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private listsService:ListsService) {}

  ngOnInit() {
    this.listsService.formatMessage();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
