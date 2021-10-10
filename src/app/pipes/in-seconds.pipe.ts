import { Pipe, PipeTransform } from '@angular/core';
import {describeTimeInSeconds} from '../models';

@Pipe({
  name: 'inSeconds'
})
export class InSecondsPipe implements PipeTransform {

  transform(ms: number): unknown {
    return describeTimeInSeconds(ms);
  }

}
