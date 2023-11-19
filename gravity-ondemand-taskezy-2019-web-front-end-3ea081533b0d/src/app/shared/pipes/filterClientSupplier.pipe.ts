import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterClientSupplier'
})

export class FilterClientSupplier implements PipeTransform {

transform(clientList, selectedValuesManaged,selectedValuesObject,selectedValuesString,returnType) {

  const isManaged9:boolean = selectedValuesManaged.includes(9);
  const isManaged10:boolean = selectedValuesManaged.includes(10);
  const hasObjectValues:boolean = selectedValuesObject.length > 0;
  const isManagedValues:boolean = selectedValuesManaged.length > 0
  const hasStringValues:boolean = Array.isArray(selectedValuesString) ? selectedValuesString.length > 0 : selectedValuesString !== '';
  const selectedValuesArray = Array.isArray(selectedValuesString) ? selectedValuesString : [selectedValuesString];
  const regexPattern = new RegExp(
    selectedValuesArray.map(keyword =>
      keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).map(keyword => `(${keyword.split(' ').join('.*')})`).join(''),
    'i'
  );
  let filteredValue = clientList.filter(client => {
    const nameMatch:boolean = regexPattern.test(client?.detail?.name.toLowerCase().replace(/ /g, ''));
    const statusMatch:boolean = selectedValuesObject.includes(client?.invitation?.status);
    const managedMatch:boolean = (client?.invitation?.email.length === 0)
    const emailLength = client?.invitation?.email.length;
    if(isManaged9 && isManaged10){
      return (hasStringValues ? nameMatch : true) && (hasObjectValues ? statusMatch : true) ;
    }
    if (isManaged9 && emailLength === 0 && !isManaged10) {
      return (hasStringValues ? nameMatch : true) && (hasObjectValues ? statusMatch : true)  && (isManagedValues? managedMatch: true);
    }
    if (isManaged10 && emailLength > 0 && !isManaged9) {
      return (hasStringValues ? nameMatch : true) && (hasObjectValues ? statusMatch : true)  && !(isManagedValues? managedMatch: true);
    }
    if(!isManaged9 && !isManaged10){
      return (hasStringValues ? nameMatch : true) && (hasObjectValues ? statusMatch : true);
    }
  });
  if (returnType === 'totalNumber') {
    return filteredValue.length;
  }
  return filteredValue;
  }}
