import { formatHost } from './format-host'
import { output } from '../output'
import ts from 'typescript'

/**
* Imprime um diagnóstico sempre que o status do watch muda.
* Isso é principalmente para mensagens como:
*  - Iniciando compilação
*  - Compilação concluída
*/
export function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
 output.note({
   title: '➜ state changed',
   bodyLines: [ts.formatDiagnostic(diagnostic, formatHost)],
 })
}