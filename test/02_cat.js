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
        short: new RegExp(`\x00*-v(?<V>E|T|ET|TE)(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      dashE: {
        group: '_',
        help: 'equivalent to -vE',
        humanReadable: '-e',
        short: new RegExp(`\x00*-e(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      dashT: {
        group: '_',
        help: 'equivalent to -vT',
        humanReadable: '-t',
        short: new RegExp(`\x00*-t(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      dashU: {
        group: '_',
        help: '(ignored)',
        humanReadable: '-u',
        short: new RegExp(`\x00*-u(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      doubleDash: {
        group: '_',
        hidden: true,
        humanReadable: '--',
        short: new RegExp(`\x00*--(\x00|$)`),
        stopParse: true,
        values: false,
        multiple: false
      },
      help: {
        group: '_',
        help: 'display this help and exit',
        humanReadable: '    --help',
        long: new RegExp(`\x00*--help(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      nonBlank: {
        group: '_',
        help: 'number nonempty output lines, overrides -n',
        humanReadable: '-b, --number-nonblank',
        long: new RegExp(`\x00*--number-nonblank(\x00|$)`),
        short: new RegExp(`\x00*-b(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      number: {
        group: '_',
        help: 'number all output lines',
        humanReadable: '-n, --number',
        long: new RegExp(`\x00*--number(\x00|$)`),
        short: new RegExp(`\x00*-n(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      showAll: {
        group: '_',
        help: 'equivalent to -vET',
        humanReadable: '-A, --show-all',
        long: new RegExp(`\x00*--show-all(\x00|$)`),
        short: new RegExp(`\x00*-A(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      showEnds: {
        group: '_',
        help: 'display $ at end of each line',
        humanReadable: '-E, --show-ends',
        long: new RegExp(`\x00*--show-ends(\x00|$)`),
        short: new RegExp(`\x00*-E(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      showNonPrinting: {
        group: '_',
        help: 'use ^ and M- notation, except for LFD and TAB',
        humanReadable: '-v, --show-nonprinting',
        long: new RegExp(`\x00*--show-nonprinting(\x00|$)`),
        short: new RegExp(`\x00*-v(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      showTabs: {
        group: '_',
        help: 'display TAB characters as ^I',
        humanReadable: '-T, --show-tabs',
        long: new RegExp(`\x00*--show-tabs(\x00|$)`),
        short: new RegExp(`\x00*-T(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      squeezeBlank: {
        group: '_',
        help: 'suppress repeated empty output lines',
        humanReadable: '-s, --squeeze-blank',
        long: new RegExp(`\x00*--squeeze-blank(\x00|$)`),
        short: new RegExp(`\x00*-s(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      version: {
        group: '_',
        help: 'output version information and exit',
        humanReadable: '    --version',
        long: new RegExp(`\x00*--version(\x00|$)`),
        stopParse: false,
        values: false,
        multiple: false
      },
      useStdin: {
        group: '_',
        hidden: true,
        humanReadable: '-',
        short: new RegExp(`\x00*-(\x00|$)`),
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
      "arg='-e\x00--\x00--version' pType='short' re='/\x00*--(\x00|$)/' matchGroups='\x00--\x00,\x00'currentParam[pType] = undefined_args is now : '-e'arg='-e' pType='short' re='/\x00*-A(\x00|$)/' matchGroups='null'arg='-e' pType='long' re='/\x00*--show-all(\x00|$)/' matchGroups='null'_args is now : '-e'arg='-e' pType='short' re='/\x00*-b(\x00|$)/' matchGroups='null'arg='-e' pType='long' re='/\x00*--number-nonblank(\x00|$)/' matchGroups='null'_args is now : '-e'arg='-e' pType='short' re='/\x00*-e(\x00|$)/' matchGroups='-e,'currentParam[pType] = undefinedbefore slice _args : '-e' found : '-e'after slice _args : ''_args is now : ''arg='' pType='short' re='/\x00*-E(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-ends(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-n(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--number(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-s(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--squeeze-blank(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-t(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-T(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-tabs(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-u(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-v(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-nonprinting(\x00|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\x00*--help(\x00|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\x00*--version(\x00|$)/' matchGroups='null'_args is now : ''_args is now : ''arg='' pType='short' re='/\x00*-v(?<V>E|T|ET|TE)(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-A(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-all(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-b(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--number-nonblank(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-e(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-E(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-ends(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-n(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--number(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-s(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--squeeze-blank(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-t(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-T(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-tabs(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-u(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-v(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-nonprinting(\x00|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\x00*--help(\x00|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\x00*--version(\x00|$)/' matchGroups='null'_args is now : ''_args is now : ''arg='' pType='short' re='/\x00*-v(?<V>E|T|ET|TE)(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-(\x00|$)/' matchGroups='null'currentParam[pType] = undefinedparam = 'showAll' values = falseparam = 'nonBlank' values = falseparam = 'dashE' values = trueparam = 'showEnds' values = falseparam = 'number' values = falseparam = 'squeezeBlank' values = falseparam = 'dashT' values = falseparam = 'showTabs' values = falseparam = 'dashU' values = falseparam = 'showNonPrinting' values = falseparam = 'help' values = falseparam = 'version' values = falseparam = 'doubleDash' values = trueparam = 'alternateV' values = falseparam = 'useStdin' values = false"
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

    // assert.strictEqual(message, [
    //   "arg='-e\x00-\x00--\x00--version' pType='short' re='/\x00*--(\x00|$)/' matchGroups='\x00--\x00,\x00'currentParam[pType] = undefined_args is now : '-e\\x00-'arg='-e\x00-' pType='short' re='/\x00*-A(\x00|$)/' matchGroups='null'arg='-e\x00-' pType='long' re='/\x00*--show-all(\x00|$)/' matchGroups='null'_args is now : '-e\x00-'arg='-e\x00-' pType='short' re='/\x00*-b(\x00|$)/' matchGroups='null'arg='-e\x00-' pType='long' re='/\x00*--number-nonblank(\x00|$)/' matchGroups='null'_args is now : '-e\\x00-'arg='-e\x00-' pType='short' re='/\x00*-e(\x00|$)/' matchGroups='-e\x00,\x00'currentParam[pType] = undefinedbefore slice _args : '-e\\x00-' found : '-e\\x00'after slice _args : '-'_args is now : '-'arg='-' pType='short' re='/\x00*-E(\x00|$)/' matchGroups='null'arg='-' pType='long' re='/\x00*--show-ends(\x00|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\x00*-n(\x00|$)/' matchGroups='null'arg='-' pType='long' re='/\x00*--number(\x00|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\x00*-s(\x00|$)/' matchGroups='null'arg='-' pType='long' re='/\x00*--squeeze-blank(\x00|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\x00*-t(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-'arg='-' pType='short' re='/\x00*-T(\x00|$)/' matchGroups='null'arg='-' pType='long' re='/\x00*--show-tabs(\x00|$)/' matchGroups='null'_args is now : '-'arg='-' pType='short' re='/\x00*-u(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-'arg='-' pType='short' re='/\x00*-v(\x00|$)/' matchGroups='null'arg='-' pType='long' re='/\x00*--show-nonprinting(\x00|$)/' matchGroups='null'_args is now : '-'currentParam[pType] = undefinedarg='-' pType='long' re='/\x00*--help(\x00|$)/' matchGroups='null'_args is now : '-'currentParam[pType] = undefinedarg='-' pType='long' re='/\x00*--version(\x00|$)/' matchGroups='null'_args is now : '-'_args is now : '-'arg='-' pType='short' re='/\x00*-v(?<V>E|T|ET|TE)(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-'arg='-' pType='short' re='/\x00*-(\x00|$)/' matchGroups='-,'currentParam[pType] = undefinedbefore slice _args : '-' found : '-'after slice _args : ''_args is now : ''arg='' pType='short' re='/\x00*-A(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-all(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-b(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--number-nonblank(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-e(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-E(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-ends(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-n(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--number(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-s(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--squeeze-blank(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-t(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-T(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-tabs(\x00|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\x00*-u(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-v(\x00|$)/' matchGroups='null'arg='' pType='long' re='/\x00*--show-nonprinting(\x00|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\x00*--help(\x00|$)/' matchGroups='null'_args is now : ''currentParam[pType] = undefinedarg='' pType='long' re='/\x00*--version(\x00|$)/' matchGroups='null'_args is now : ''_args is now : ''arg='' pType='short' re='/\x00*-v(?<V>E|T|ET|TE)(\x00|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\x00*-(\x00|$)/' matchGroups='null'currentParam[pType] = undefinedparam = 'showAll' values = falseparam = 'nonBlank' values = falseparam = 'dashE' values = trueparam = 'showEnds' values = falseparam = 'number' values = falseparam = 'squeezeBlank' values = falseparam = 'dashT' values = falseparam = 'showTabs' values = falseparam = 'dashU' values = falseparam = 'showNonPrinting' values = falseparam = 'help' values = falseparam = 'version' values = falseparam = 'doubleDash' values = trueparam = 'alternateV' values = falseparam = 'useStdin' values = true"
    // ].join('\n'))
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
