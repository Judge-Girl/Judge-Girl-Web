import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ide-banner',
  templateUrl: './ide-banner.component.html',
  styleUrls: ['./ide-banner.component.css'],
})
export class IdeBannerComponent {
  @Input() h1: string;
  @Input() h2: string;
  @Input() previousPageName: string;
  @Output() goPreviousPage = new EventEmitter<void>();
}
