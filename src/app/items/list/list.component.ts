import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Item } from '../models/Item';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  items: Item[] = [];
  rootUrl = '';
  prevURL = '';
  nextURL = '';
  totalPage = 0;
  totalFound = 0;
  currentPage: number;
  filterObject = {
    limit: 10,
    query: '',
    price: 1
  }
  selectedSortType: string;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.getItems(this.rootUrl, this.filterObject);
  }


  getItems(targetUrl, filterObj): void {
    this.itemService.getItems(targetUrl, filterObj).subscribe(
      res => {
        this.items = res['results'].map(i => Object.assign(new Item(), i));
        this.prevURL = res[`previous`];
        this.nextURL = res[`next`];
        this.totalPage = res[`total_pages`];
        this.totalFound = res[`count`];
        this.currentPage = res[`current_page`];
        console.log(this.items);

      }, err => { throw err; }
    );
  }

  sort(items: Item[]): void {
    if (this.selectedSortType === 'asc')
      items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    if (this.selectedSortType === 'desc')
      items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

}
