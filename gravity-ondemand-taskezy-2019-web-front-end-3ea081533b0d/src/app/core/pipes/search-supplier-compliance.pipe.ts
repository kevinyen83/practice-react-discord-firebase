import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchSupplierCompliance'
})
@Injectable()
export class SearchSupplierCompliancePipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    if (!items.filteredData) {
      return [];
    }
    if (searchText === '') {
      return items.filteredData;
    }
    searchText = searchText.toLowerCase();
    return items.filteredData.filter(
      (it) => it.name.toLowerCase().includes(searchText) || it.identifier.toLowerCase().includes(searchText) || it.tradingname.toLowerCase().includes(searchText) || it.phoneNumber.toLowerCase().includes(searchText)
    );
  }
}
