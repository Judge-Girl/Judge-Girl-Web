import {ExamService} from '../Services';
import {StubProblemService} from './StubProblemService';
import {Observable, Subject} from 'rxjs';
import {Problem, Exam, ExamItem} from '../../models';


export class StubExamService extends ExamService {
  private readonly problemService: StubProblemService;
  private readonly exams: Exam[];
  private readonly problems: Problem[];

  constructor() {
    super();
    this.problemService = new StubProblemService();
    this.problems = this.problemService.problems;

    this.exams = [
      new Exam(1, 'TEST1', new Date(2021, 0, 1), new Date(2021, 0, 1, 14), 
               [this.problems[0]], '* anno\n1. `Markdown` test\n2. meow', '## note\nnote'),
      new Exam(2, 'TEST2', new Date(2021, 0, 10, 15), new Date(2021, 0, 10, 21), 
               [this.problems[0], this.problems[1]], 'anno2', 'note2'),
      new Exam(3, 'TEST3', new Date(2021, 0, 20, 11, 22, 33), new Date(2021, 0, 20, 22, 33, 44), 
               [this.problems[0], this.problems[1], this.problems[2]], 'anno3', 'note3'),
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
