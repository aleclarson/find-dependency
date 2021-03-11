interface Options {
  cwd?: string
  skipGlobal?: boolean
}

declare const findDependency: {
  (name: string, cwd?: string): string | undefined
  (name: string, options: Options): string | undefined
}

export = findDependency
