import {ProblemService} from '../Services';
import {Observable} from 'rxjs';
import {Pagination, Problem, ProblemItem} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpRequestCache} from './HttpRequestCache';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpProblemService extends ProblemService {
    httpRequestCache: HttpRequestCache;
    baseUrl: string;

    constructor(protected http: HttpClient) {
        super();
        this.httpRequestCache = new HttpRequestCache(http);
        this.baseUrl = environment.problemServiceBaseUrl;
    }

    getProblem(problemId: number): Observable<Problem> {
        return this.httpRequestCache.get(`${this.baseUrl}/api/problems/${problemId}`)
            .pipe(map(body => this.toProblem(body)));
    }

    getProblemItemsByTag(problemTag: string): Observable<ProblemItem[]> {
        return this.httpRequestCache.get(`${this.baseUrl}/api/problems?tags=${problemTag}`);
    }

    getProblemItemsInPage(page: number): Observable<Pagination<ProblemItem>> {
        return this.httpRequestCache.get(`${this.baseUrl}/api/problems?page=0`)
            .pipe(map(body => this.transferToPagination(page, body)));
    }

    getProblemTags(): Observable<string[]> {
        return this.httpRequestCache.get(`${this.baseUrl}/api/problems/tags`);
    }

    toProblem(body): Problem {
        return new Problem(body.id, body.title, body.description, body.tags, body.languageEnvs,
            body.testcases);
    }

    private transferToPagination(page, body): Pagination<ProblemItem> {
        const pageSize = 10;
        const list = body.filter((element, index) => {
            if (index >= (page - 1) * pageSize && index < (page * pageSize)) {
                return element;
            }
        });
        return new Pagination(page, pageSize, body.length, list);
    }
}
