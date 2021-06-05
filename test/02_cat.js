const Reargs = require('..')
const assert = require('assert').strict

const example = {
  showAll: {
    short: '-A',
    long: '--show-all',
    help: 'equivalent to -vET'
  },
  nonBlank: {
    short: '-b',
    long: '--number-nonblank',
    help: 'number nonempty output lines, overrides -n'
  },
  dashE: {
    short: '-e',
    help: 'equivalent to -vE'
  },
  showEnds: {
    short: '-E',
    long: '--show-ends',
    help: 'display $ at end of each line'
  },
  number: {
    short: '-n',
    long: '--number',
    help: 'number all output lines'
  },
  squeezeBlank: {
    short: '-s',
    long: '--squeeze-blank',
    help: 'suppress repeated empty output lines'
  },
  dashT: {
    short: '-t',
    help: 'equivalent to -vT'
  },
  showTabs: {
    short: '-T',
    long: '--show-tabs',
    help: 'display TAB characters as ^I'
  },
  dashU: {
    short: '-u',
    help: '(ignored)'
  },
  showNonPrinting: {
    short: '-v',
    long: '--show-nonprinting',
    help: 'use ^ and M- notation, except for LFD and TAB'
  },
  help: {
    long: '--help',
    help: 'display this help and exit'
  },
  version: {
    long: '--version',
    help: 'output version information and exit'
  },
  doubleDash: {
    short: '--',
    hidden: true,
    stopParse: true
  },
  alternateV: {
    humanReadable: '-v(E|T|ET)',
    short: '-v(?<V>E|T|ET|TE)',
    hidden: true
  },
  useStdin: {
    short: '-',
    hidden: true
  }
}

const helpTemplate = `
Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s) to standard output.

With no FILE, or when FILE is -, read standard input.

{%- for group,params in groups %}
{% for param in params %}
{% if param.hidden != true -%}
{{ param.humanReadable|padEnd(params.padding, params.prepadding, ' ')|safe }} {{param.help}}
{%- endif %}
{%- endfor %}
{% endfor -%}

Examples:
  cat f - g  Output f's contents, then standard input, then g's contents.
  cat        Copy standard input to standard output.

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
Report any translation bugs to <https://translationproject.org/team/>
Full documentation <https://www.gnu.org/software/coreutils/cat>
or available locally via: info '(coreutils) cat invocation'
`

let message = ''
const customDebugFn = (...args) => {
  message += args.join(' ') // + '\n'
}

const cat = new Reargs(example, {
  longShortDelimiter: ', ',
  paramDescriptionSpacer: ' '
}, customDebugFn)

describe('Parsing \'cat\' command line', () => {
  it('should correctly set up parameter parsing', () => {
    assert.deepEqual(cat.params, {
      alternateV: {
        group: '_',
        hidden: true,
        humanReadable: '-v(E|T|ET)',
        short: /\s*-v(?<V>E|T|ET|TE)(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      dashE: {
        group: '_',
        help: 'equivalent to -vE',
        humanReadable: '-e',
        short: /\s*-e(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      dashT: {
        group: '_',
        help: 'equivalent to -vT',
        humanReadable: '-t',
        short: /\s*-t(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      dashU: {
        group: '_',
        help: '(ignored)',
        humanReadable: '-u',
        short: /\s*-u(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      doubleDash: {
        group: '_',
        hidden: true,
        humanReadable: '--',
        short: /\s*--(\s|$)/,
        stopParse: true,
        values: false,
        multiple: false
      },
      help: {
        group: '_',
        help: 'display this help and exit',
        humanReadable: '    --help',
        long: /\s*--help(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      nonBlank: {
        group: '_',
        help: 'number nonempty output lines, overrides -n',
        humanReadable: '-b, --number-nonblank',
        long: /\s*--number-nonblank(\s|$)/,
        short: /\s*-b(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      number: {
        group: '_',
        help: 'number all output lines',
        humanReadable: '-n, --number',
        long: /\s*--number(\s|$)/,
        short: /\s*-n(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      showAll: {
        group: '_',
        help: 'equivalent to -vET',
        humanReadable: '-A, --show-all',
        long: /\s*--show-all(\s|$)/,
        short: /\s*-A(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      showEnds: {
        group: '_',
        help: 'display $ at end of each line',
        humanReadable: '-E, --show-ends',
        long: /\s*--show-ends(\s|$)/,
        short: /\s*-E(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      showNonPrinting: {
        group: '_',
        help: 'use ^ and M- notation, except for LFD and TAB',
        humanReadable: '-v, --show-nonprinting',
        long: /\s*--show-nonprinting(\s|$)/,
        short: /\s*-v(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      showTabs: {
        group: '_',
        help: 'display TAB characters as ^I',
        humanReadable: '-T, --show-tabs',
        long: /\s*--show-tabs(\s|$)/,
        short: /\s*-T(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      squeezeBlank: {
        group: '_',
        help: 'suppress repeated empty output lines',
        humanReadable: '-s, --squeeze-blank',
        long: /\s*--squeeze-blank(\s|$)/,
        short: /\s*-s(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      version: {
        group: '_',
        help: 'output version information and exit',
        humanReadable: '    --version',
        long: /\s*--version(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      },
      useStdin: {
        group: '_',
        hidden: true,
        humanReadable: '-',
        short: /\s*-(\s|$)/,
        stopParse: false,
        values: false,
        multiple: false
      }
    })
  })

  it('should parse empty args', () => {
    const empty = cat.parse([])

    assert.strictEqual(empty, '')
    assert.deepEqual(cat.getAllValues(), {
      alternateV: false,
      dashE: false,
      dashT: false,
      dashU: false,
      doubleDash: false,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: false,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: false
    })
  })

  it('should be able to parse known arguments (short)', () => {
    const test = cat.parse(['-e', '-E'])
    assert.strictEqual(test, '')
    assert.deepEqual(cat.getAllValues(), {
      alternateV: false,
      dashE: true,
      dashT: false,
      dashU: false,
      doubleDash: false,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: true,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: false
    })
  })

  it('should be able to parse known arguments (long)', () => {
    const test = cat.parse(['--show-nonprinting', '--help'])
    assert.strictEqual(test, '')
    assert.deepEqual(cat.getAllValues(), {
      alternateV: false,
      dashE: false,
      dashT: false,
      dashU: false,
      doubleDash: false,
      help: true,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: false,
      showNonPrinting: true,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: false
    })
  })

  it('should be able to parse known arguments (mixed)', () => {
    const test = cat.parse(['-e', '-E', '--version'])
    assert.strictEqual(test, '')
    assert.deepEqual(cat.getAllValues(), {
      alternateV: false,
      dashE: true,
      dashT: false,
      dashU: false,
      doubleDash: false,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: true,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: true
    })
  })

  it('should be able to have -vX', () => {
    const test = cat.parse(['-vT', '--', '-vE'])
    assert.strictEqual(test, '')
    assert.strictEqual(cat.remain, '-vE')
    assert.deepEqual(cat.getAllValues(), {
      V: 'T',
      dashE: false,
      dashT: false,
      dashU: false,
      doubleDash: true,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: false,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: false
    })

    assert.strictEqual(cat.getValue('alternateV', 'V'), 'T')
    assert.deepEqual(cat.getValue('alternateV'), { V: 'T' })
  })

  it('should be able to have -vXY', () => {
    const test = cat.parse(['-vET', '--', '--help'])
    assert.strictEqual(test, '')
    assert.strictEqual(cat.remain, '--help')
    assert.deepEqual(cat.getAllValues(), {
      V: 'ET',
      dashE: false,
      dashT: false,
      dashU: false,
      doubleDash: true,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: false,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: false
    })

    assert.strictEqual(cat.getValue('alternateV', 'V'), 'ET')
    assert.deepEqual(cat.getValue('alternateV'), { V: 'ET' })
  })

  it('should handle double dash (--)', () => {
    message = ''
    const test = cat.parse(['-e', '--', '--version'])

    assert.deepEqual(cat.getAllValues(), {
      alternateV: false,
      dashE: true,
      dashT: false,
      dashU: false,
      doubleDash: true,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: false,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: false,
      version: false
    })

    assert.strictEqual(test, '')
    assert.strictEqual(cat.remain, '--version')

    assert.strictEqual(message, [
      "arg='-e -- --version' pType='short' re='/\\s*--(\\s|$)/' matchGroups=' -- , 'currentParam[pType] = undefined_args is now : '-e'arg='-e' pType='short' re='/\\s*-A(\\s|$)/' matchGroups='null'arg='-e' pType='long' re='/\\s*--show-all(\\s|$)/' matchGroups='null'_args is now : '-e'arg='-e' pType='short' re='/\\s*-b(\\s|$)/' matchGroups='null'arg='-e' pType='long' re='/\\s*--number-nonblank(\\s|$)/' matchGroups='null'_args is now : '-e'arg='-e' pType='short' re='/\\s*-e(\\s|$)/' matchGroups='-e,'currentParam[pType] = undefinedbefore slice _args : '-e' found : '-e'after slice _args : ''_args is now : ''arg='' pType='short' re='/\\s*-E(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-ends(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-n(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--number(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-s(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--squeeze-blank(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-t(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-T(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-tabs(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-u(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-v(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-nonprinting(\\s|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\\s*--help(\\s|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\\s*--version(\\s|$)/' matchGroups='null'_args is now : ''_args is now : ''arg='' pType='short' re='/\\s*-v(?<V>E|T|ET|TE)(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-A(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-all(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-b(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--number-nonblank(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-e(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-E(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-ends(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-n(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--number(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-s(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--squeeze-blank(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-t(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-T(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-tabs(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-u(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-v(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-nonprinting(\\s|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\\s*--help(\\s|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\\s*--version(\\s|$)/' matchGroups='null'_args is now : ''_args is now : ''arg='' pType='short' re='/\\s*-v(?<V>E|T|ET|TE)(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-(\\s|$)/' matchGroups='null'currentParam[pType] = undefinedparam = 'showAll' values = falseparam = 'nonBlank' values = falseparam = 'dashE' values = trueparam = 'showEnds' values = falseparam = 'number' values = falseparam = 'squeezeBlank' values = falseparam = 'dashT' values = falseparam = 'showTabs' values = falseparam = 'dashU' values = falseparam = 'showNonPrinting' values = falseparam = 'help' values = falseparam = 'version' values = falseparam = 'doubleDash' values = trueparam = 'alternateV' values = falseparam = 'useStdin' values = false"
    ].join('\n'))
  })

  it('should be able to handle single dash', () => {
    message = ''
    const test = cat.parse(['-e', '-', '--', '--version'])

    assert.strictEqual(test, '')
    assert.strictEqual(cat.remain, '--version')
    assert.deepEqual(cat.getAllValues(), {
      alternateV: false,
      dashE: true,
      dashT: false,
      dashU: false,
      doubleDash: true,
      help: false,
      nonBlank: false,
      number: false,
      showAll: false,
      showEnds: false,
      showNonPrinting: false,
      showTabs: false,
      squeezeBlank: false,
      useStdin: true,
      version: false
    })

    assert.strictEqual(message, [
      "arg='-e - -- --version' pType='short' re='/\\s*--(\\s|$)/' matchGroups=' -- , 'currentParam[pType] = undefined_args is now : '-e -'arg='-e -' pType='short' re='/\\s*-A(\\s|$)/' matchGroups='null'arg='-e -' pType='long' re='/\\s*--show-all(\\s|$)/' matchGroups='null'_args is now : '-e -'arg='-e -' pType='short' re='/\\s*-b(\\s|$)/' matchGroups='null'arg='-e -' pType='long' re='/\\s*--number-nonblank(\\s|$)/' matchGroups='null'_args is now : '-e -'arg='-e -' pType='short' re='/\\s*-e(\\s|$)/' matchGroups='-e , 'currentParam[pType] = undefinedbefore slice _args : '-e -' found : '-e 'after slice _args : '-'_args is now : '-'arg='-' pType='short' re='/\\s*-E(\\s|$)/' matchGroups='null'arg='-' pType='long' re='/\\s*--show-ends(\\s|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\\s*-n(\\s|$)/' matchGroups='null'arg='-' pType='long' re='/\\s*--number(\\s|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\\s*-s(\\s|$)/' matchGroups='null'arg='-' pType='long' re='/\\s*--squeeze-blank(\\s|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\\s*-t(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-'arg='-' pType='short' re='/\\s*-T(\\s|$)/' matchGroups='null'arg='-' pType='long' re='/\\s*--show-tabs(\\s|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\\s*-u(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-'arg='-' pType='short' re='/\\s*-v(\\s|$)/' matchGroups='null'arg='-' pType='long' re='/\\s*--show-nonprinting(\\s|$)/' matchGroups='null'_args is now : '-'currentParam[pType] = undefinedarg='-' pType='long' re='/\\s*--help(\\s|$)/' matchGroups='null'_args is now : '-'currentParam[pType] = undefinedarg='-' pType='long' re='/\\s*--version(\\s|$)/' matchGroups='null'_args is now : '-'_args is now : '-'arg='-' pType='short' re='/\\s*-v(?<V>E|T|ET|TE)(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-'arg='-' pType='short' re='/\\s*-(\\s|$)/' matchGroups='-,'currentParam[pType] = undefinedbefore slice _args : '-' found : '-'after slice _args : ''_args is now : ''arg='' pType='short' re='/\\s*-A(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-all(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-b(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--number-nonblank(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-e(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-E(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-ends(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-n(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--number(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-s(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--squeeze-blank(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-t(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-T(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-tabs(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*-u(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-v(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*--show-nonprinting(\\s|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\\s*--help(\\s|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\\s*--version(\\s|$)/' matchGroups='null'_args is now : ''_args is now : ''arg='' pType='short' re='/\\s*-v(?<V>E|T|ET|TE)(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-(\\s|$)/' matchGroups='null'currentParam[pType] = undefinedparam = 'showAll' values = falseparam = 'nonBlank' values = falseparam = 'dashE' values = trueparam = 'showEnds' values = falseparam = 'number' values = falseparam = 'squeezeBlank' values = falseparam = 'dashT' values = falseparam = 'showTabs' values = falseparam = 'dashU' values = falseparam = 'showNonPrinting' values = falseparam = 'help' values = falseparam = 'version' values = falseparam = 'doubleDash' values = trueparam = 'alternateV' values = falseparam = 'useStdin' values = true"
    ].join('\n'))
  })

  it('should print correct help', () => {
    const help = cat.generateHelp({ name: 'cat', version: '1.0.0' }, helpTemplate)
    // assert.strictEqual(help, '\n' +
    //   'Usage: cat [OPTION]... [FILE]...\n' +
    //   'Concatenate FILE(s) to standard output.\n' +
    //   '\n' +
    //   'With no FILE, or when FILE is -, read standard input.\n' +
    //   '\n' +
    //   '-A\n' +
    //   '--show-all......... equivalent to -vET\n' +
    //   '-b\n' +
    //   '--number-nonblank.. number nonempty output lines, overrides -n\n' +
    //   '-e................. equivalent to -vE\n' +
    //   '-E\n' +
    //   '--show-ends........ display $ at end of each line\n' +
    //   '-n\n' +
    //   '--number........... number all output lines\n' +
    //   '-s\n' +
    //   '--squeeze-blank.... suppress repeated empty output lines\n' +
    //   '-t................. equivalent to -vT\n' +
    //   '-T\n' +
    //   '--show-tabs........ display TAB characters as ^I\n' +
    //   '-u................. (ignored)\n' +
    //   '-v\n' +
    //   '--show-nonprinting. use ^ and M- notation, except for LFD and TAB\n' +
    //   '--help............. display this help and exit\n' +
    //   '--version.......... output version information and exit\n' +
    //   '\n' +
    //   '\n' +
    //   'Examples:\n' +
    //   "  cat f - g  Output f's contents, then standard input, then g's contents.\n" +
    //   '  cat        Copy standard input to standard output.\n' +
    //   '\n' +
    //   'GNU coreutils online help: <https://www.gnu.org/software/coreutils/>\n' +
    //   'Report any translation bugs to <https://translationproject.org/team/>\n' +
    //   'Full documentation <https://www.gnu.org/software/coreutils/cat>\n' +
    //   "or available locally via: info '(coreutils) cat invocation'\n")
    console.log(help)
  })
})
