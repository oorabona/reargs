const Reargs = require('..')
const assert = require('assert').strict

const example = {
  help: {
    help: 'this help or additional help on a given topic',
    short: '((?<topic>[\\w|\\/]+) )?-h',
    long: 'help( (?<topic>[\\w|\\/]+))?'
  }
}

const exampleWithOverride = {
  help: {
    help: 'this help or additional help on a given topic',
    short: '((?<help>[\\w|\\/]+) )?-h',
    long: 'help( (?<help>[\\w|\\/]+))?'
  }
}

const exampleWithStopParse = {
  help: {
    help: 'this help or additional help on a given topic',
    short: '((?<topic>[\\w|\\/]+) )?-h',
    long: 'help( (?<topic>[\\w|\\/]+))?',
    stopParse: true
  }
}

const exampleWithDefaultValue = {
  help: {
    help: 'this help or additional help on a given topic',
    short: /((?<topic>[\w|/]+) )?-h/,
    long: /help( (?<topic>[\w|/]+))?/,
    values: {
      topic: 'general'
    }
  }
}

let message = ''
const customDebugFn = (...args) => {
  message += args.join(' ') // + '\n'
}

const myArgs = new Reargs(example, {
  longShortDelimiter: ', ',
  paramDescriptionSpacer: ' '
}, customDebugFn)

describe('Testing advanced use of capture groups (without stopParse)', () => {
  it('should be able to process only "help"', () => {
    const unparsable = myArgs.parse(['help'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, undefined)
    assert.strictEqual(myArgs.getValue(), null)
    assert.deepEqual(myArgs.getValue('help'), {
      topic: undefined
    })
    assert.deepEqual(myArgs.getGroupValues(), {})
    assert.deepEqual(myArgs.getGroupValues('_'), {
      topic: undefined
    })
    assert.deepEqual(myArgs.getAllValues(), {
      topic: undefined
    })
  })

  it('should be able to process "help foo"', () => {
    const unparsable = myArgs.parse(['help', 'foo'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.strictEqual(myArgs.getValue(), null)
    assert.deepEqual(myArgs.getValue('help'), {
      topic: 'foo'
    })
    assert.deepEqual(myArgs.getGroupValues(), {})
    assert.deepEqual(myArgs.getGroupValues('_'), {
      topic: 'foo'
    })
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'foo'
    })
  })

  it('should be able to process only "-h"', () => {
    const unparsable = myArgs.parse(['-h'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, undefined)
    assert.deepEqual(myArgs.getAllValues(), {
      topic: undefined
    })
  })

  it('should be able to process "foo -h"', () => {
    const unparsable = myArgs.parse(['foo', '-h'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'foo'
    })
  })
})

describe('Testing advanced use of capture groups (capture group have the same name as parameter)', () => {
  it('should be able to process only "help"', () => {
    assert.strictEqual(myArgs.setup(exampleWithOverride), true)
    const unparsable = myArgs.parse(['help'])
    const valueOfParam = myArgs.getValue('help', 'help')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, undefined)
    assert.strictEqual(myArgs.getValue(), null)
    assert.deepEqual(myArgs.getValue('help'), {
      help: undefined
    })
    assert.deepEqual(myArgs.getGroupValues(), {})
    assert.deepEqual(myArgs.getGroupValues('_'), {
      help: undefined
    })
    assert.deepEqual(myArgs.getAllValues(), {
      help: undefined
    })
  })

  it('should be able to process "help foo"', () => {
    const unparsable = myArgs.parse(['help', 'foo'])
    const valueOfParam = myArgs.getValue('help', 'help')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.strictEqual(myArgs.getValue(), null)
    assert.deepEqual(myArgs.getValue('help'), {
      help: 'foo'
    })
    assert.deepEqual(myArgs.getGroupValues(), {})
    assert.deepEqual(myArgs.getGroupValues('_'), {
      help: 'foo'
    })
    assert.deepEqual(myArgs.getAllValues(), {
      help: 'foo'
    })
  })

  it('should be able to process only "-h"', () => {
    const unparsable = myArgs.parse(['-h'])
    const valueOfParam = myArgs.getValue('help', 'help')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, undefined)
    assert.deepEqual(myArgs.getAllValues(), {
      help: undefined
    })
  })

  it('should be able to process "foo -h"', () => {
    const unparsable = myArgs.parse(['foo', '-h'])
    const valueOfParam = myArgs.getValue('help', 'help')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.deepEqual(myArgs.getAllValues(), {
      help: 'foo'
    })
  })
})

describe('Testing advanced use of capture groups (with stopParse)', () => {
  it('should be able to process only "help"', () => {
    message = ''
    assert.strictEqual(myArgs.setup(exampleWithStopParse), true)
    const unparsable = myArgs.parse(['help'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, undefined)
    assert.deepEqual(myArgs.getAllValues(), {
      topic: undefined
    })
  })

  it('should be able to process "help foo"', () => {
    const unparsable = myArgs.parse(['help', 'foo'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'foo'
    })
  })

  it('should be able to process only "-h"', () => {
    const unparsable = myArgs.parse(['-h'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, undefined)
    assert.deepEqual(myArgs.getAllValues(), {
      topic: undefined
    })
  })

  it('should be able to process "foo -h"', () => {
    const unparsable = myArgs.parse(['foo', '-h'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'foo'
    })
  })
})

describe('Testing advanced use of capture groups (with default value)', () => {
  it('should be able to process only "help"', () => {
    message = ''
    assert.strictEqual(myArgs.setup(exampleWithDefaultValue), true)
    const unparsable = myArgs.parse(['help'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'general')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'general'
    })
  })

  it('should be able to process "help foo"', () => {
    const unparsable = myArgs.parse(['help', 'foo'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'foo'
    })
  })

  it('should be able to process only "-h"', () => {
    const unparsable = myArgs.parse(['-h'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'general')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'general'
    })
  })

  it('should be able to process "foo -h"', () => {
    const unparsable = myArgs.parse(['foo', '-h'])
    const valueOfParam = myArgs.getValue('help', 'topic')

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(valueOfParam, 'foo')
    assert.deepEqual(myArgs.getAllValues(), {
      topic: 'foo'
    })
  })
})
