import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

/**
 * To declare a variable in the html: https://stackoverflow.com/questions/38582293/how-to-declare-a-variable-in-a-template-in-angular
 */
@Directive({
  selector: '[ngVar]',
})
export class VarDirective {
  @Input()
  set ngVar(context: unknown) {
    this.context.$implicit = this.context.ngVar = context;

    if (!this.hasView) {
      this.vcRef.createEmbeddedView(this.templateRef, this.context);
      this.hasView = true;
    }
  }

  private context: {
    $implicit: unknown;
    ngVar: unknown;
  } = {
    $implicit: null,
    ngVar: null,
  };

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef
  ) {
  }
}
