const Reargs = require('..')
const assert = require('assert').strict

const example = {
  debug: {
    help: 'Activate debug mode (default: false)',
    short: '-[-]?d(ebug)?',
    group: 'option',
    values: false
  },
  help: {
    help: 'Show this help',
    short: 'help|-[-]?h(elp)?',
    // stopParse: true,
    group: 'command',
    values: false
  },
  listApiSubsets: {
    help: 'List OVH API subsets',
    short: '-l',
    long: 'api subsets( ls)?',
    group: 'command'
    // stopParse: true
  },
  listOperation: {
    help: 'Perform a listing operation',
    short: 'ls',
    long: 'list',
    group: 'command'
  },
  shellOperation: {
    help: 'Open an interactive shell',
    short: 'sh(ell)?',
    group: 'command'
  },
  useApiSubset: {
    help: 'Use API subset (default: me)',
    short: /-u[=| ](?<apiSubset>[\w|/]+)/,
    long: /api subset use (?<apiSubset>[\w|/]+)/,
    group: 'option',
    values: {
      apiSubset: 'me'
    }
  }
}

let message = ''
const customDebugFn = (...args) => {
  message += args.join(' ') // + '\n'
}

const test = new Reargs(example, null, customDebugFn)

describe('Parsing command line switches', () => {
  it('should be able to correctly identify groups', () => {
    const expectedGroups = {
      command: [
        {
          help: 'Show this help',
          humanReadable: 'help|-[-]?h(elp)?'
        },
        {
          help: 'List OVH API subsets',
          humanReadable: '-l\napi subsets( ls)?'
        },
        {
          help: 'Perform a listing operation',
          humanReadable: 'ls\nlist'
        },
        {
          help: 'Open an interactive shell',
          humanReadable: 'sh(ell)?'
        }
      ],
      option: [
        {
          help: 'Activate debug mode (default: false)',
          humanReadable: '-[-]?d(ebug)?'
        },
        {
          help: 'Use API subset (default: me)',
          humanReadable: '-u[=| ]<apiSubset>\napi subset use <apiSubset>'
        }
      ]
    }
    expectedGroups.command.padding = 18
    expectedGroups.command.prepadding = 2
    expectedGroups.option.padding = 27
    expectedGroups.option.prepadding = 2

    assert.deepEqual(test.groups, expectedGroups)
  })

  it('should be able to parse against empty argument list', () => {
    test.parse([])
    // assert.strictEqual(message, [
    //   "param: short of type string | _param: /\\s*-[-]?d(ebug)?(\\s|$)/ | _param.humanReadable: -[-]?d(ebug)?param: short of type string | _param: /\\s*help|-[-]?h(elp)?(\\s|$)/ | _param.humanReadable: help|-[-]?h(elp)?param: short of type string | _param: /\\s*-l(\\s|$)/ | _param.humanReadable: -lparam: long of type string | _param: /\\s*api subsets( ls)?(\\s|$)/ | _param.humanReadable: api subsets( ls)?param: short of type string | _param: /\\s*ls(\\s|$)/ | _param.humanReadable: lsparam: long of type string | _param: /\\s*list(\\s|$)/ | _param.humanReadable: listparam: short of type string | _param: /\\s*sh(ell)?(\\s|$)/ | _param.humanReadable: sh(ell)?param: short of type object | _param: /-u[=| ](?<apiSubset>[\\w|/]+)/ | _param.humanReadable: -u[=| ]<apiSubset>param: long of type object | _param: /api subset use (?<apiSubset>[\\w|/]+)/ | _param.humanReadable: api subset use <apiSubset>_args is now : ''arg='' pType='short' re='/\\s*-[-]?d(ebug)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*help|-[-]?h(elp)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/\\s*-l(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*api subsets( ls)?(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*ls(\\s|$)/' matchGroups='null'arg='' pType='long' re='/\\s*list(\\s|$)/' matchGroups='null'_args is now : ''arg='' pType='short' re='/\\s*sh(ell)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : ''arg='' pType='short' re='/-u[=| ](?<apiSubset>[\\w|/]+)/' matchGroups='null'arg='' pType='long' re='/api subset use (?<apiSubset>[\\w|/]+)/' matchGroups='null'"
    // ].join('\n'))

    assert.deepEqual(test.getGroupValues('command'), {
      help: false,
      listApiSubsets: false,
      listOperation: false,
      shellOperation: false
    })
    assert.deepEqual(test.getGroupValues('option'), {
      apiSubset: 'me',
      debug: false
    })
  })

  it('should be able to reset after parsing against empty argument list', () => {
    test.reset()

    assert.deepEqual(test.getGroupValues('command'), {
      help: false,
      listApiSubsets: false,
      listOperation: false,
      shellOperation: false
    })
    assert.deepEqual(test.getGroupValues('option'), {
      apiSubset: 'me',
      debug: false
    })
  })

  it('should be able to parse one command', () => {
    test.parse(['help'])

    assert.deepEqual(test.getGroupValues('command'), {
      help: true,
      listApiSubsets: false,
      listOperation: false,
      shellOperation: false
    })
  })

  it('should be able to parse multiple (wrong) commands', () => {
    message = ''
    const unparsed = test.parse(['listapi', 'foo'])

    assert.deepEqual(test.getGroupValues('command'), {
      help: false,
      listApiSubsets: false,
      listOperation: false,
      shellOperation: false
    })

    // assert.strictEqual(message, [
    //   "_args is now : 'listapi foo'arg='listapi foo' pType='short' re='/\\s*-[-]?d(ebug)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'listapi foo'arg='listapi foo' pType='short' re='/\\s*help|-[-]?h(elp)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'listapi foo'arg='listapi foo' pType='short' re='/\\s*-l(\\s|$)/' matchGroups='null'arg='listapi foo' pType='long' re='/\\s*api subsets( ls)?(\\s|$)/' matchGroups='null'_args is now : 'listapi foo'arg='listapi foo' pType='short' re='/\\s*ls(\\s|$)/' matchGroups='null'arg='listapi foo' pType='long' re='/\\s*list(\\s|$)/' matchGroups='null'_args is now : 'listapi foo'arg='listapi foo' pType='short' re='/\\s*sh(ell)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'listapi foo'arg='listapi foo' pType='short' re='/-u[=| ](?<apiSubset>[\\w|/]+)/' matchGroups='null'arg='listapi foo' pType='long' re='/api subset use (?<apiSubset>[\\w|/]+)/' matchGroups='null'param = 'help' values = falseparam = 'listApiSubsets' values = falseparam = 'listOperation' values = falseparam = 'shellOperation' values = false"
    // ].join('\n'))

    assert.deepEqual(test.getGroupValues('option'), {
      apiSubset: 'me',
      debug: false
    })

    assert.strictEqual(unparsed, 'listapi foo')
    assert.strictEqual(test.remain, '')

    assert.deepEqual(test.getAllValues(), {
      help: false,
      listApiSubsets: false,
      listOperation: false,
      shellOperation: false,
      apiSubset: 'me',
      debug: false
    })
  })

  it('should be able to parse multiple (right and wrong) commands', () => {
    message = ''
    const unparsed = test.parse(['list', 'foo', 'api'])

    assert.deepEqual(test.getGroupValues('command'), {
      help: false,
      listApiSubsets: false,
      listOperation: true,
      shellOperation: false
    })

    // assert.strictEqual(message, [
    //   "_args is now : 'list foo api'arg='list foo api' pType='short' re='/\\s*-[-]?d(ebug)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'list foo api'arg='list foo api' pType='short' re='/\\s*help|-[-]?h(elp)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'list foo api'arg='list foo api' pType='short' re='/\\s*-l(\\s|$)/' matchGroups='null'arg='list foo api' pType='long' re='/\\s*api subsets( ls)?(\\s|$)/' matchGroups='null'_args is now : 'list foo api'arg='list foo api' pType='short' re='/\\s*ls(\\s|$)/' matchGroups='null'arg='list foo api' pType='long' re='/\\s*list(\\s|$)/' matchGroups='list , 'before slice _args : 'list foo api' found : 'list 'after slice _args : 'foo api'_args is now : 'foo api'arg='foo api' pType='short' re='/\\s*sh(ell)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'foo api'arg='foo api' pType='short' re='/-u[=| ](?<apiSubset>[\\w|/]+)/' matchGroups='null'arg='foo api' pType='long' re='/api subset use (?<apiSubset>[\\w|/]+)/' matchGroups='null'_args is now : 'foo api'arg='foo api' pType='short' re='/\\s*-[-]?d(ebug)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'foo api'arg='foo api' pType='short' re='/\\s*help|-[-]?h(elp)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'foo api'arg='foo api' pType='short' re='/\\s*-l(\\s|$)/' matchGroups='null'arg='foo api' pType='long' re='/\\s*api subsets( ls)?(\\s|$)/' matchGroups='null'_args is now : 'foo api'arg='foo api' pType='short' re='/\\s*ls(\\s|$)/' matchGroups='null'arg='foo api' pType='long' re='/\\s*list(\\s|$)/' matchGroups='null'_args is now : 'foo api'arg='foo api' pType='short' re='/\\s*sh(ell)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'foo api'arg='foo api' pType='short' re='/-u[=| ](?<apiSubset>[\\w|/]+)/' matchGroups='null'arg='foo api' pType='long' re='/api subset use (?<apiSubset>[\\w|/]+)/' matchGroups='null'param = 'help' values = falseparam = 'listApiSubsets' values = falseparam = 'listOperation' values = trueparam = 'shellOperation' values = false"
    // ].join('\n'))

    assert.deepEqual(test.getGroupValues('option'), {
      apiSubset: 'me',
      debug: false
    })

    assert.strictEqual(unparsed, 'foo api')
    assert.strictEqual(test.remain, '')
  })

  it('should be able to parse multiple (right and wrong) commands and options', () => {
    message = ''
    const unparsed = test.parse(['list', '-u', 'foo', 'api'])

    // assert.strictEqual(message, [
    //   "_args is now : 'list -u foo api'arg='list -u foo api' pType='short' re='/\\s*-[-]?d(ebug)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'list -u foo api'arg='list -u foo api' pType='short' re='/\\s*help|-[-]?h(elp)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'list -u foo api'arg='list -u foo api' pType='short' re='/\\s*-l(\\s|$)/' matchGroups='null'arg='list -u foo api' pType='long' re='/\\s*api subsets( ls)?(\\s|$)/' matchGroups='null'_args is now : 'list -u foo api'arg='list -u foo api' pType='short' re='/\\s*ls(\\s|$)/' matchGroups='null'arg='list -u foo api' pType='long' re='/\\s*list(\\s|$)/' matchGroups='list , 'before slice _args : 'list -u foo api' found : 'list 'after slice _args : '-u foo api'_args is now : '-u foo api'arg='-u foo api' pType='short' re='/\\s*sh(ell)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : '-u foo api'arg='-u foo api' pType='short' re='/-u[=| ](?<apiSubset>[\\w|/]+)/' matchGroups='-u foo,foo'arg=' api' pType='long' re='/api subset use (?<apiSubset>[\\w|/]+)/' matchGroups='null'before slice _args : '-u foo api' found : '-u foo'after slice _args : ' api'_args is now : 'api'arg='api' pType='short' re='/\\s*-[-]?d(ebug)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'api'arg='api' pType='short' re='/\\s*help|-[-]?h(elp)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'api'arg='api' pType='short' re='/\\s*-l(\\s|$)/' matchGroups='null'arg='api' pType='long' re='/\\s*api subsets( ls)?(\\s|$)/' matchGroups='null'_args is now : 'api'arg='api' pType='short' re='/\\s*ls(\\s|$)/' matchGroups='null'arg='api' pType='long' re='/\\s*list(\\s|$)/' matchGroups='null'_args is now : 'api'arg='api' pType='short' re='/\\s*sh(ell)?(\\s|$)/' matchGroups='null'currentParam[pType] = undefined_args is now : 'api'arg='api' pType='short' re='/-u[=| ](?<apiSubset>[\\w|/]+)/' matchGroups='null'arg='api' pType='long' re='/api subset use (?<apiSubset>[\\w|/]+)/' matchGroups='null'"
    // ].join('\n'))

    assert.deepEqual(test.getGroupValues('command'), {
      help: false,
      listApiSubsets: false,
      listOperation: true,
      shellOperation: false
    })

    assert.deepEqual(test.getValue('useApiSubset'), {
      apiSubset: 'foo'
    })

    assert.strictEqual(test.getValue('useApiSubset', 'apiSubset'), 'foo')
    assert.strictEqual(test.getValue('foo'), null)
    assert.strictEqual(test.getValue('useApiSubset', 'foo'), undefined)
    assert.strictEqual(test.getValue('foo', 'foo'), null)

    assert.deepEqual(test.getGroupValues('option'), {
      apiSubset: 'foo',
      debug: false
    })

    assert.strictEqual(unparsed, 'api')
    assert.strictEqual(test.remain, '')
  })

  it('should not output anything if group name does not exist', () => {
    assert.deepEqual(test.getGroupValues('doesnotexist'), {})
  })

  it('should generate help properly with default template and default context', () => {
    message = ''
    assert.strictEqual(test.generateHelp(), '\n' +
      'Your app v0.0.0 - This description needs to be customized ! - by John Doe\n' +
      '\n' +
      'Usage:\n' +
      '  Your app [option] [command]\n' +
      '\n' +
      '\n' +
      'Options:\n' +
      '\n' +
      '  -[-]?d(ebug)?............... Activate debug mode (default: false)\n' +
      '  -u[=| ]<apiSubset>\n' +
      'api subset use <apiSubset>.. Use API subset (default: me)\n' +
      '\n' +
      'Commands:\n' +
      '\n' +
      '  help|-[-]?h(elp)?.. Show this help\n' +
      '  -l\n' +
      'api subsets( ls)?.. List OVH API subsets\n' +
      '  ls\n' +
      'list............... Perform a listing operation\n' +
      '  sh(ell)?........... Open an interactive shell\n')
    console.log(test.generateHelp())
  })

  it('should generate help properly with default template and custom context', () => {
    message = ''
    assert.strictEqual(test.generateHelp({ version: '1.0.0' }), '\n' +
      'Your app v1.0.0 - This description needs to be customized ! - by John Doe\n' +
      '\n' +
      'Usage:\n' +
      '  Your app [option] [command]\n' +
      '\n' +
      '\n' +
      'Options:\n' +
      '\n' +
      '  -[-]?d(ebug)?............... Activate debug mode (default: false)\n' +
      '  -u[=| ]<apiSubset>\n' +
      'api subset use <apiSubset>.. Use API subset (default: me)\n' +
      '\n' +
      'Commands:\n' +
      '\n' +
      '  help|-[-]?h(elp)?.. Show this help\n' +
      '  -l\n' +
      'api subsets( ls)?.. List OVH API subsets\n' +
      '  ls\n' +
      'list............... Perform a listing operation\n' +
      '  sh(ell)?........... Open an interactive shell\n')
  })
})
