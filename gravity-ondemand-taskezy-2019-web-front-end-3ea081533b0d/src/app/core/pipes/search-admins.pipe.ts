import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAdmins'
})

@Injectable()
export class SearchAdminsPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (searchText === '') {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter((it) => it.firstName.toLowerCase().includes(searchText));
  }
}
