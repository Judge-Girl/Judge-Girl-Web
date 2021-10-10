import { Pipe, PipeTransform } from '@angular/core';
import {describeMemory} from '../models';

@Pipe({
  name: 'describeMemory'
})
export class DescribeMemoryPipe implements PipeTransform {

  transform(bytes: number): string {
    return describeMemory(bytes);
  }

}
