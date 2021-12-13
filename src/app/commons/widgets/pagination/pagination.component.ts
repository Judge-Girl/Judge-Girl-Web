import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
        if (this.pagination === undefined) {
            this.pagination = new Pagination(1, 0, 0, []);
        }
    }

    changeToPage(page: number) {
        this.changePage.emit(page);
    }

}
