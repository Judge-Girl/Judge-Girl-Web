import { Component, OnInit } from '@angular/core';
import {Problem} from '../Problem';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['../style.css', './problem-description.component.css']
})
export class ProblemDescriptionComponent implements OnInit {

  constructor(public problem: Problem) { }

  ngOnInit(): void {
  }

}
