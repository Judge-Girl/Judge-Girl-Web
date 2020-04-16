export class TestCase {
  constructor(public name: string,
              public timeLimit: number,
              public memoryLimit: number,
              public outputLimit: number,
              public threadNumberLimit: number,
              public grade: number) {
  }
}

export class ProblemItem {
  constructor(public id: number,
              public title: string) {
  }
}

export class JudgeSpec {
  constructor(public language: string,
              public environment: string,
              public cpu: number,
              public gpu: number) {
  }
}

export class SubmittedCodeSpec {
  constructor(public language: string, public fileName: string) {
  }
}

export class Compilation {
  constructor(public script: string) {
  }
}

export class Problem extends ProblemItem {

  constructor(id: number, title: string,
              public markdownDescription: string,
              public problemTags: string[],
              public submittedCodeSpecs: SubmittedCodeSpec[],
              public zippedProvidedCodesFileId: string,
              public compilation: Compilation) {
    super(id, title);
  }
}
