import {Injectable} from '@angular/core';

@Injectable()
export class Problem {
  id: number;
  title: string;
  description: string;
  exampleInput: string;
  exampleOutput: string;
}
