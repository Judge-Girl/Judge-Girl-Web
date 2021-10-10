import {Component, OnInit} from '@angular/core';

// Reference: https://loading.io/css
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ld-circle',
  template: '<div class="lds-circle"><div></div></div>',
  styleUrls: ['./ld-circle.component.css']
})
export class LdCircleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
