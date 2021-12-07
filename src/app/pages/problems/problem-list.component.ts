 import {Component, OnChanges, OnInit} from '@angular/core';
import {ProblemService} from '../../services/Services';
import {PageResult, ProblemItem} from '../../models';
import {Router} from '@angular/router';


@Component({
    selector: 'app-problem-list',
    templateUrl: './problem-list.component.html',
    styleUrls: ['../../../animations.css', './problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

    pageResult: PageResult<ProblemItem> = new PageResult();
    loadingProblems = false;

    constructor(private problemService: ProblemService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.loadingProblems = true;
        // Currently we do not support 'Pagination', therefore use the 0th page as default.
        this.getPageTestData(1);
    }


    routeToProblem(problemId: number) {
        this.router.navigateByUrl(`problems/${problemId}`);
    }

    /**
     * 暫時測試用(需等後端 API完成)
     */
    getPageTestData(page: number) {
        this.loadingProblems = true;
        this.problemService.getProblemItemsInPage(page)
            .subscribe(items => {
                this.loadingProblems = false;
                this.pageResult = this.getTestData(items, page);
            });
    }


    /**
     * 暫時產生測試資料用，屆時會移除
     */
    private getTestData(items: ProblemItem[], pageNumber: number): PageResult<ProblemItem> {
        if (pageNumber !== 1) {
            items = [{id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testB']}];
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
            items.push({id: Math.floor(Math.random() * 10000), title: 'test', tags: ['test', 'testA']});
        }
        return {data: items, currentPage: pageNumber, totalRecords: 500, pageSize: 5};
    }

    /**
     * 後端API完成後使用此function
     */
    getPageData(pageNumber: number) {
        this.loadingProblems = true;
        this.problemService.getProblemItemsInPages(pageNumber)
            .subscribe(result => {
                this.loadingProblems = false;
                this.pageResult = result;
            });
    }

}
