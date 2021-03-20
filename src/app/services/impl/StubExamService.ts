import {ExamService} from '../Services';
import {Observable, Subject} from 'rxjs';
import { Exam, ExamItem, ExamProblem } from '../../models';


export class StubExamService extends ExamService {
  private readonly exams: Exam[];
  private readonly problems: ExamProblem[];

  constructor() {
    super();
    this.problems = [
      new ExamProblem(10203, "problem 1", 10, 20, "--", 87),
      new ExamProblem(50102, "problem 2", 40, 20, "--", 87),
      new ExamProblem(10204, "problem 3", 100, 979, "--", 87),
      new ExamProblem(10205, "problem 4", 10, 20, "--", 0),
    ];

    this.exams = [
      new Exam(1, 'TEST1', new Date(2021, 0, 1), new Date(2021, 0, 1, 14), 
               this.problems, '* anno\n1. `Markdown` test\n2. meow\n## Title 2\n### Title 3\n#### Title 4\n'),
      new Exam(2, 'TEST2', new Date(2021, 0, 10, 15), new Date(2021, 0, 10, 21), 
               [this.problems[0], this.problems[1]], 'anno2'),
      new Exam(3, 'TEST3', new Date(2021, 0, 20, 11, 22, 33), new Date(2021, 0, 20, 22, 33, 44), 
               this.problems, 'anno3'),
    ];
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

  getExamsByStudentId(studentId: number, examType?: string): Observable<ExamItem[]> {
    return new Observable<ExamItem[]>(observer => {
      setTimeout(() => {
        observer.next(this.exams);
        observer.complete();
      }, 400);
      return () => {
      };
    });
  }
}
