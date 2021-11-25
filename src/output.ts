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
  private readonly DEV_PREFIX = `${chalk.cyan(
    '>'
  )} ${chalk.reset.inverse.bold.cyan(' DEV ')}`

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
      label: chalk.reset.inverse.bold.red(' ERRO '),
      title: chalk.bold.red(title),
    })

    this.writeOptionalOutputBody(bodyLines)
  }

  note({ title, bodyLines }: CLIMessageConfig) {
    this.writeOutputTitle({
      label: chalk.reset.inverse.bold.keyword('orange')(' NOTA '),
      title: chalk.bold.keyword('orange')(title),
    })

    this.writeOptionalOutputBody(bodyLines)
  }

  logSingleLine(title: string) {
    this.writeOutputTitle({ title })
  }
}

export const output = new CLIOutput()