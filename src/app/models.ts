export class ProblemItem {
  constructor(public id: number,
              public title: string,
              public description: string) {
  }
}

export class Problem extends ProblemItem {
  exampleInput: string;
  exampleOutput: string;


  constructor(id: number, title: string, description: string, exampleInput: string, exampleOutput: string) {
    super(id, title, description);
    this.exampleInput = exampleInput;
    this.exampleOutput = exampleOutput;
  }
}
