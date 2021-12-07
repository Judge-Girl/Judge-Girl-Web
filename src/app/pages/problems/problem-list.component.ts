import {Component, OnChanges, OnInit} from '@angular/core';
import {ProblemService} from '../../services/Services';
import {Pagination, ProblemItem} from '../../models';
import {Router} from '@angular/router';


@Component({
    selector: 'app-problem-list',
    templateUrl: './problem-list.component.html',
    styleUrls: ['../../../animations.css', './problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

    problemPagination: Pagination<ProblemItem>;
    loadingProblems = false;

    constructor(private problemService: ProblemService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.loadingProblems = true;
        // Currently we do not support 'Pagination', therefore use the 0th page as default.
        this.getPagination(1);
    }


    routeToProblem(problemId: number) {
        this.router.navigateByUrl(`problems/${problemId}`);
    }

    /**
     * 暫時測試用(需等後端 API完成)
     */
    getPagination(page: number) {
        this.loadingProblems = true;
        this.problemService.getProblemItemsInPage(page)
            .subscribe(items => {
                this.loadingProblems = false;
                this.problemPagination = items;
                // 暫時產生測試資料用，屆時會移除
                this.problemPagination = this.getTestData(items, page);
            });
    }


    /**
     * 暫時產生測試資料用，屆時會移除
     */
    private getTestData(items1: Pagination<ProblemItem>, pageNumber: number): Pagination<ProblemItem> {
        items1.items = [{id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testB']}];
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        items1.items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        return {items: items1.items, page: pageNumber, totalCount: 500, pageSize: 5};
    }


}
