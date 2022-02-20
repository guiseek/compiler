import chalk from 'chalk'

export interface CLIOutputTitle {
  title: string
  label?: string
}

export interface CLIMessageConfig {
  title: string
  bodyLines?: string[]
}

class CLIOutput {
  private readonly DEV_PREFIX = `${chalk.rgb(0, 255, 247)('➜')} ${chalk.reset.cyan(
    ' dev '
  )}`

  private writeToStdOut(str: string) {
    process.stdout.write(str)
  }

  private writeOutputTitle({ label, title }: CLIOutputTitle): void {
    let outputTitle: string

    if (label) outputTitle = `${this.DEV_PREFIX} ${label} ${title}\n`
    else outputTitle = `${this.DEV_PREFIX} ${title}\n`

    this.writeToStdOut(outputTitle)
  }

  private writeOptionalOutputBody(bodyLines?: string[]): void {
    if (!bodyLines) return

    bodyLines.forEach((bodyLine) => {
      this.writeToStdOut('  ' + bodyLine + '\n')
    })
  }

  addNewline() {
    this.writeToStdOut('\n')
  }

  error({ title, bodyLines }: CLIMessageConfig) {
    this.writeOutputTitle({
      label: chalk.reset.red(' error '),
      title: chalk.red(title),
    })

    this.writeOptionalOutputBody(bodyLines)
  }

  note({ title, bodyLines }: CLIMessageConfig) {
    this.writeOutputTitle({
      label: chalk.reset.rgb(255, 234, 7)('➜ status'),
      title: chalk.rgb(81, 214, 86)(title),
    })

    this.writeOptionalOutputBody(bodyLines)
  }

  logSingleLine(title: string) {
    this.writeOutputTitle({ title })
  }
}

export const output = new CLIOutput()
