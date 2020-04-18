import {Directive, ElementRef} from '@angular/core';
import {StudentService} from '../services/Services';
import {Router} from '@angular/router';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[authenticated]'
})
export class AuthenticatedDirective {
  private sub: any = null;

  constructor(private studentService: StudentService,
              private router: Router,
              private location: Location,
              private elementRef: ElementRef) {
    if (!studentService.hasLogin()) {
      elementRef.nativeElement.style.display = 'none';
    }
  }
}
