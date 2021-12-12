import { output } from './output'
import ts from 'typescript'

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (path) => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
}

function dev({
  path = './'
}) {
  const configPath = ts.findConfigFile(
    path,
    ts.sys.fileExists,
    'tsconfig.json'
  )
  if (!configPath) {
    const message = 'Não foi encontrado um arquivo \'tsconfig.json\' válido.'
    output.error({
      title: 'Configuração inválida ou ausente',
      bodyLines: [message]
    })
    throw new Error(message)
  }
  
  /**
   * O TypeScript pode usar várias "estratégias" de criação de programa diferentes:
   * * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
   * * ts.createSemanticDiagnosticsBuilderProgram
   * * ts.createAbstractBuilder
   * 
   * Os dois primeiros produzem "programas construtores". Estes usam uma estratégia incremental
   * para verificar novamente e emitir arquivos cujo conteúdo pode ter sido alterado, ou cujas
   * dependências podem ter alterações que podem afetar a alteração do resultado da verificação
   * de tipo anterior e emissão.
   * 
   * O último usa um programa comum que faz uma verificação completa de tipo após cada alteração.
   * Entre `createEmitAndSemanticDiagnosticsBuilderProgram` e `createSemanticDiagnosticsBuilderProgram`,
   * a única diferença é emit.
   * 
   * Para cenários de verificação de tipo puro, ou quando outra ferramenta / processo manipula emitem,
   * usar `createSemanticDiagnosticsBuilderProgram` pode ser mais desejável.
   */
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  /**
   * Observe que há outra sobrecarga para `createWatchCompilerHost`
   * que leva um conjunto de arquivos raiz.
   */
  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  )

  /**
   * Você pode substituir tecnicamente qualquer gancho no host,
   * embora provavelmente não seja necessário.
   * 
   * Observe que estamos assumindo que `origCreateProgram`
   * e` origPostProgramCreate` não usam `this`.
   */

  const origCreateProgram = host.createProgram
  host.createProgram = (
    rootNames: ReadonlyArray<string> | undefined,
    options,
    host,
    oldProgram
  ) => {
    output.logSingleLine("Iniciando compilação...")
    return origCreateProgram(rootNames, options, host, oldProgram)
  }

  const origPostProgramCreate = host.afterProgramCreate

  host.afterProgramCreate = (program) => {
    output.logSingleLine('Compilação concluída!')
    origPostProgramCreate!(program)
    output.addNewline()
  }

  /**
   * `createWatchProgram` cria um programa inicial, observa
   * os arquivos e atualiza o programa ao longo do tempo.
   */
  ts.createWatchProgram(host)
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  output.error({
    title: `Erro ${diagnostic.code}`,
    bodyLines: [diagnostic.messageText.toString()]
  })
  output.addNewline()
}

/**
 * Imprime um diagnóstico sempre que o status do watch muda.
 * Isso é principalmente para mensagens como:
 *  - Iniciando compilação
 *  - Compilação concluída
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  output.note({
    title: 'Estado',
    bodyLines: [
      ts.formatDiagnostic(diagnostic, formatHost)
    ]
  })
}

export { dev }
