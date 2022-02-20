import { output } from '../output'
import ts from 'typescript'

export function reportDiagnostic(diagnostic: ts.Diagnostic) {
  output.error({
    title: `Erro ${diagnostic.code}`,
    bodyLines: [diagnostic.messageText.toString()],
  })
  output.addNewline()
}
