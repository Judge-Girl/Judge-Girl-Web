
export class ProblemItem {
  constructor(public id: number,
              public title: string,
              public description: string) {
  }
}

export class Problem {
  constructor(public id: number,
              public title: string,
              public description: string,
              public exampleInput: string,
              public exampleOutput: string) {
  }
}
