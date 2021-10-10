import {Component, OnInit} from '@angular/core';

// Reference: https://loading.io/css
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ld-spinner',
  template: '<div class="lds-spinner"><div></div><div></div><div></div><div>' +
    '</div><div></div><div></div><div></div><div></div><div></div><div></div' +
    '><div></div><div></div></div>',
  styleUrls: ['./ld-spinner.component.css']
})
export class LdSpinnerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
