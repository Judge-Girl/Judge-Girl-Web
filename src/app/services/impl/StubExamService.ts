import {ExamService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {Compilation, ExamItem, SubmittedCodeSpec, TestCase} from '../../models';


export class StubExamService extends ExamService {
  private readonly examItems: ExamItem[];

  constructor() {
    super();
    this.examItems = [
      new ExamItem(1, 'TEST1', new Date(2021, 0, 1), new Date(2021, 0, 1, 14)),
      new ExamItem(2, 'TEST2', new Date(2021, 0, 10, 15), new Date(2021, 0, 10, 21)),
      new ExamItem(3, 'TEST3', new Date(2021, 0, 20, 11, 22, 33), new Date(2021, 0, 20, 22, 33, 44)),
    ];
  }


  getExam(examId: number): Observable<ExamItem> {
    const exam$ = new Subject<ExamItem>();
    setTimeout(() => {
      for (const exam of this.examItems) {
        if (exam.id === examId) {
          exam$.next(exam);
        }
      }
      exam$.complete();
    }, 700);
    return exam$;
  }

  getExamsByStudentId(studentId: number, examType?: string): Observable<ExamItem[]> {
    return new Observable<ExamItem[]>(observer => {
      setTimeout(() => {
        observer.next(this.examItems);
        observer.complete();
      }, 400);
      return () => {
      };
    });
  }
}
