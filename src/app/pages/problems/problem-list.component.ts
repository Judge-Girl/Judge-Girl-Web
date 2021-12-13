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
        this.getPagination(1);
    }


    routeToProblem(problemId: number) {
        this.router.navigateByUrl(`problems/${problemId}`);
    }

    getPagination(page: number) {
        this.loadingProblems = true;
        this.problemService.getProblemItemsInPage(page)
            .subscribe(items => {
                this.loadingProblems = false;
                this.problemPagination = items;
            });
    }

}
