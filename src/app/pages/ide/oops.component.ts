import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-error-oops',
  templateUrl: './oops.component.html',
  styleUrls: ['./oops.component.css']
})
export class OopsComponent {
  @Input() messages: string[];
  @Input() goBackMessage: string;
  @Output() goBack = new EventEmitter<void>();
}
