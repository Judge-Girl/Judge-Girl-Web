import {ExamService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {Compilation, Exam, ExamItem, SubmittedCodeSpec, TestCase} from '../../models';


export class StubExamService extends ExamService {
  private readonly exams: Exam[];

  private readonly stubTag1 = 'OpenMP';
  private readonly stubTag2 = 'cUDA';
  private readonly examTags = [this.stubTag1, this.stubTag2];

  constructor() {
    super();
    this.exams = [
      new Exam(1, 'TEST1', 'This is test1', new Date(2021, 0, 1), new Date(2021, 0, 1, 14), [this.stubTag1]),
      new Exam(2, 'TEST2', 'This is test2', new Date(2021, 0, 10, 15), new Date(2021, 0, 10, 21), [this.stubTag2]),
      new Exam(3, 'TEST3', 'This is test3', new Date(2021, 0, 20, 11, 22, 33), new Date(2021, 0, 20, 22, 33, 44), [this.stubTag1, this.stubTag2]),
    ];
  }


  getExamItemsInPage(page: number): Observable<ExamItem[]> {
    return new Observable<ExamItem[]>(observer => {
      setTimeout(() => {
        observer.next(this.exams);
        observer.complete();
      }, 400);
      return () => {
      };
    });
  }


  getExam(examId: number): Observable<Exam> {
    const exam$ = new Subject<Exam>();
    setTimeout(() => {
      for (const exam of this.exams) {
        if (exam.id === examId) {
          exam$.next(exam);
        }
      }
      exam$.complete();
    }, 700);
    return exam$;
  }

  getExamItemsByTag(examTag: string): Observable<ExamItem[]> {
    const exam$ = new Subject<Exam[]>();
    setTimeout(() => {
      exam$.next(this.exams.filter(p => p.examTags.includes(examTag)));
      exam$.complete();
    }, 700);
    return exam$;
  }

  getExamTags(): Observable<string[]> {
    const examTag$ = new Subject<string[]>();
    setTimeout(() => {
      examTag$.next(this.examTags);
      examTag$.complete();
    }, 700);
    return examTag$;
  }

}
