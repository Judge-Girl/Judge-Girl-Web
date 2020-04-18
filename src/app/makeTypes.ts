// Stores the currently-being-typechecked object for error messages.
let obj: any = null;

export class ProblemProxy {
  public readonly id: number;
  public readonly title: string;
  public readonly markdownDescription: string;
  public readonly judgeSpec: JudgeSpecProxy;
  public readonly judgePolicyPluginTag: JudgePolicyPluginTagProxy;
  public readonly tags: string[] | null;
  public readonly submittedCodeMetas: SubmittedCodeMetasEntityProxy[] | null;
  public readonly zippedProvidedCodesFileId: string;
  public readonly zippedTestCaseInputsFileId: string;
  public readonly zippedTestCaseOutputsFileId: string;
  public readonly compilation: CompilationProxy;

  public static Parse(d: string): ProblemProxy {
    return ProblemProxy.Create(JSON.parse(d));
  }

  public static Create(d: any, field: string = 'root'): ProblemProxy {
    if (!field) {
      obj = d;
      field = 'root';
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof (d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkNumber(d.id, false, field + '.id');
    checkString(d.title, false, field + '.title');
    checkString(d.markdownDescription, false, field + '.markdownDescription');
    d.judgeSpec = JudgeSpecProxy.Create(d.judgeSpec, field + '.judgeSpec');
    d.judgePolicyPluginTag = JudgePolicyPluginTagProxy.Create(d.judgePolicyPluginTag, field + '.judgePolicyPluginTag');
    checkArray(d.tags, field + '.tags');
    if (d.tags) {
      for (let i = 0; i < d.tags.length; i++) {
        checkString(d.tags[i], false, field + '.tags' + '[' + i + ']');
      }
    }
    if (d.tags === undefined) {
      d.tags = null;
    }
    checkArray(d.submittedCodeMetas, field + '.submittedCodeMetas');
    if (d.submittedCodeMetas) {
      for (let i = 0; i < d.submittedCodeMetas.length; i++) {
        d.submittedCodeMetas[i] = SubmittedCodeMetasEntityProxy.Create(d.submittedCodeMetas[i], field +
          '.submittedCodeMetas' + '[' + i + ']');
      }
    }
    if (d.submittedCodeMetas === undefined) {
      d.submittedCodeMetas = null;
    }
    checkString(d.zippedProvidedCodesFileId, false, field + '.zippedProvidedCodesFileId');
    checkString(d.zippedTestCaseInputsFileId, false, field + '.zippedTestCaseInputsFileId');
    checkString(d.zippedTestCaseOutputsFileId, false, field + '.zippedTestCaseOutputsFileId');
    d.compilation = CompilationProxy.Create(d.compilation, field + '.compilation');
    return new ProblemProxy(d);
  }

  private constructor(d: any) {
    this.id = d.id;
    this.title = d.title;
    this.markdownDescription = d.markdownDescription;
    this.judgeSpec = d.judgeSpec;
    this.judgePolicyPluginTag = d.judgePolicyPluginTag;
    this.tags = d.tags;
    this.submittedCodeMetas = d.submittedCodeMetas;
    this.zippedProvidedCodesFileId = d.zippedProvidedCodesFileId;
    this.zippedTestCaseInputsFileId = d.zippedTestCaseInputsFileId;
    this.zippedTestCaseOutputsFileId = d.zippedTestCaseOutputsFileId;
    this.compilation = d.compilation;
  }
}

export class JudgeSpecProxy {
  public readonly language: string;
  public readonly environment: string;
  public readonly cpu: number;
  public readonly gpu: number;

  public static Parse(d: string): JudgeSpecProxy {
    return JudgeSpecProxy.Create(JSON.parse(d));
  }

  public static Create(d: any, field: string = 'root'): JudgeSpecProxy {
    if (!field) {
      obj = d;
      field = 'root';
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof (d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkString(d.language, false, field + '.language');
    checkString(d.environment, false, field + '.environment');
    checkNumber(d.cpu, false, field + '.cpu');
    checkNumber(d.gpu, false, field + '.gpu');
    return new JudgeSpecProxy(d);
  }

  private constructor(d: any) {
    this.language = d.language;
    this.environment = d.environment;
    this.cpu = d.cpu;
    this.gpu = d.gpu;
  }
}

export class JudgePolicyPluginTagProxy {
  public readonly type: string;
  public readonly group: string;
  public readonly name: string;
  public readonly version: string;

  public static Parse(d: string): JudgePolicyPluginTagProxy {
    return JudgePolicyPluginTagProxy.Create(JSON.parse(d));
  }

  public static Create(d: any, field: string = 'root'): JudgePolicyPluginTagProxy {
    if (!field) {
      obj = d;
      field = 'root';
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof (d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkString(d.type, false, field + '.type');
    checkString(d.group, false, field + '.group');
    checkString(d.name, false, field + '.name');
    checkString(d.version, false, field + '.version');
    return new JudgePolicyPluginTagProxy(d);
  }

  private constructor(d: any) {
    this.type = d.type;
    this.group = d.group;
    this.name = d.name;
    this.version = d.version;
  }
}

export class SubmittedCodeMetasEntityProxy {
  public readonly language: string;
  public readonly fileName: string;

  public static Parse(d: string): SubmittedCodeMetasEntityProxy {
    return SubmittedCodeMetasEntityProxy.Create(JSON.parse(d));
  }

  public static Create(d: any, field: string = 'root'): SubmittedCodeMetasEntityProxy {
    if (!field) {
      obj = d;
      field = 'root';
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof (d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkString(d.language, false, field + '.language');
    checkString(d.fileName, false, field + '.fileName');
    return new SubmittedCodeMetasEntityProxy(d);
  }

  private constructor(d: any) {
    this.language = d.language;
    this.fileName = d.fileName;
  }
}

export class CompilationProxy {
  public readonly script: string;

  public static Parse(d: string): CompilationProxy {
    return CompilationProxy.Create(JSON.parse(d));
  }

  public static Create(d: any, field: string = 'root'): CompilationProxy {
    if (!field) {
      obj = d;
      field = 'root';
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof (d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkString(d.script, false, field + '.script');
    return new CompilationProxy(d);
  }

  private constructor(d: any) {
    this.script = d.script;
  }
}

function throwNull2NonNull(field: string, d: any): never {
  return errorHelper(field, d, 'non-nullable object', false);
}

function throwNotObject(field: string, d: any, nullable: boolean): never {
  return errorHelper(field, d, 'object', nullable);
}

function throwIsArray(field: string, d: any, nullable: boolean): never {
  return errorHelper(field, d, 'object', nullable);
}

function checkArray(d: any, field: string): void {
  if (!Array.isArray(d) && d !== null && d !== undefined) {
    errorHelper(field, d, 'array', true);
  }
}

function checkNumber(d: any, nullable: boolean, field: string): void {
  if (typeof (d) !== 'number' && (!nullable || (nullable && d !== null && d !== undefined))) {
    errorHelper(field, d, 'number', nullable);
  }
}

function checkString(d: any, nullable: boolean, field: string): void {
  if (typeof (d) !== 'string' && (!nullable || (nullable && d !== null && d !== undefined))) {
    errorHelper(field, d, 'string', nullable);
  }
}

function errorHelper(field: string, d: any, type: string, nullable: boolean): never {
  if (nullable) {
    type += ', null, or undefined';
  }
  throw new TypeError('Expected ' + type + ' at ' + field + ' but found:\n' + JSON.stringify(d) + '\n\nFull object:\n' + JSON.stringify(obj));
}
