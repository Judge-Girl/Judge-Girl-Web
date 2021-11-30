import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../../services/Services';
import {PageProps, ProblemItem} from '../../models';
import {Router} from '@angular/router';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['../../../animations.css', './problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problemItems: ProblemItem[];
  pageProps: PageProps;
  loadingProblems = false;

  constructor(private problemService: ProblemService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.problemItems = [];
    this.loadingProblems = true;
    this.pageProps = new PageProps();
    // Currently we do not support 'Pagination', therefore use the 0th page as default.
    this.getPageTestData(1);
  }

  routeToProblem(problemId: number) {
    this.router.navigateByUrl(`problems/${problemId}`);
  }

  // 暫時測試用(需等後端 API完成)
  getPageTestData(pageNumber: number) {
    this.loadingProblems = true;
    this.problemService.getProblemItemsInPage(pageNumber)
      .subscribe(items => {
        this.loadingProblems = false;
        this.problemItems = items;
        this.pageProps.totalRecords = 500;
      });
  }
  // 後端 API完成後，使用此function
  getPageData(pageNumber: number) {
    this.loadingProblems = true;
    this.problemService.getProblemItemsInPages(pageNumber)
      .subscribe(result => {
        this.loadingProblems = false;
        this.problemItems = result.data;
        this.pageProps.totalRecords = result.totalCount;
      });
  }
}
