// import {ExamService} from '../Services';
// import {Observable, Subject} from 'rxjs';
// import {ExamOverview, ExamItem, QuestionOverview} from '../../models';
// import {ExamStatus} from './HttpExamService';
//
//
// export class StubExamService extends ExamService {
//   private readonly exams: ExamOverview[];
//   private readonly problems: QuestionOverview[];
//
//   constructor() {
//     super();
//     this.problems = [
//       new QuestionOverview(10203, 'problem 1', 10, 20, 20, 1, '--', 87),
//       new QuestionOverview(50102, 'problem 2', 40, 20, 40, 2, '--', 87),
//       new QuestionOverview(10204, 'problem 3', 100, 979, 1000, 3, '--', 87),
//       new QuestionOverview(10205, 'problem 4', 10, 20, 50, 4, '--', 0),
//     ];
//
//     this.exams = [
//       new ExamOverview(1, 'TEST1', new Date(2021, 0, 1), new Date(2021, 0, 1, 14),
//         this.problems, '* anno\n1. `Markdown` test\n2. meow\n## Title 2\n### Title 3\n#### Title 4\n'),
//       new ExamOverview(2, 'TEST2', new Date(2021, 0, 10, 15), new Date(2021, 0, 10, 21),
//         [this.problems[0], this.problems[1]], 'anno2'),
//       new ExamOverview(3, 'TEST3', new Date(2021, 0, 20, 11, 22, 33), new Date(2021, 0, 20, 22, 33, 44),
//         this.problems, 'anno3'),
//     ];
//   }
//
//
//   getExamProgressOverview(examId: number): Observable<ExamOverview> {
//     const exam$ = new Subject<ExamOverview>();
//     setTimeout(() => {
//       for (const exam of this.exams) {
//         if (exam.id === examId) {
//           exam$.next(exam);
//         }
//       }
//       exam$.complete();
//     }, 700);
//     return exam$;
//   }
//
//   getExamsByStudentId(studentId: number, examStatus: ExamStatus = ExamStatus.all,
//                       skip: number = 0, size: number = 50): Observable<ExamItem[]> {
//     return new Observable<ExamItem[]>(observer => {
//       setTimeout(() => {
//         observer.next(this.exams.slice(skip, skip + size - 1));
//         observer.complete();
//       }, 400);
//       return () => {
//       };
//     });
//   }
// }
