import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagination} from '../../../models';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
    @Input()
    pagination: Pagination<any>;

    @Output()
    changePage: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

    changeToPage(page: number) {
        this.changePage.emit(page);
    }

}
