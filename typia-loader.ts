/**
 * This source code refers to the source code of Typia.
 * https://github.com/samchon/typia/blob/v3.8.6/src/programmers/TypiaProgrammer.ts
 */

import { resolve, dirname } from "path";
import {transform} from 'typia/lib/transform'
import ts from "typescript";
const tsconfig = resolve("./tsconfig.json");

// const resource = './src/App.tsx';

interface LoaderOptions {
  resource: string;
  tsconfig: string;
}

interface WebpackLoader {
  getOptions(): LoaderOptions;
  async(): (err: Error | null, source?: string) => void;
}

export default function webpackLoader(source: string) {
  if (!source.includes("typia")) return source;
  const resource = this.resourcePath;
  const cb = this.async();
  const diagnostics = [];
  console.log('this', this.resourcePath);
  console.log('resource', resource, tsconfig);
  console.log('source', source);
  (async () => {
    const { options: compilerOptions } = ts.parseJsonConfigFileContent(
      ts.readConfigFile(tsconfig, ts.sys.readFile).config,
      {
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
      },
      dirname(tsconfig)
    );

    const program = ts.createProgram([resource], compilerOptions);
      // console.log('program', program);
      // console.log('bb', program.getSourceFile(resource)!);
    // DO TRANSFORM
    const result = ts.transform(
      program.getSourceFile(resource)!,
      [
        transform(
          program,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((compilerOptions.plugins as any[]) ?? []).find(
            (p) =>
              p.transform === "typia/lib/transform" ||
              p.transform === "../src/transform.ts"
          ) ?? {},
          {
            addDiagnostic: (diag: ts.Diagnostic) => {
              console.log('diag', diag);
              return diagnostics.push(diag);
            }
          }
        ),
      ],
      compilerOptions
    );

    // ARCHIVE TRANSFORMED FILES
    const printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    });
    for (const file of result.transformed) {
      const content = printer.printFile(file);
      console.log(result, content);
      return cb(null, content);
    }

    cb(null, source);
  })();
}