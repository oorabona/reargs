const Reargs = require('..')
const assert = require('assert').strict

const params = {
  kv1: {
    help: 'set key value pairs one at a time',
    short: '-e (?<key>[\\w]+)?:(?<value>[\\w]+)?',
    humanReadable: '-e key:value',
    multiple: true,
    values: {
      key: 'defaultKey',
      value: 'defaultValue'
    }
  },
  kv2: {
    help: 'set key value pairs all together',
    short: '-a ',
    humanReadable: '-a key:value,key:value,...',
    captureMultiple: '(?<key2>[\\w]+)?:(?<value2>[\\w]+)?,?',
    values: {
      key2: 'defaultKey2',
      value2: 'defaultValue2'
    }
  },
  kv3: {
    group: 'kv3',
    help: 'set key value pairs all together ... multiple times !',
    short: '-b ',
    humanReadable: '-b key:value,key:value,...',
    captureMultiple: '(?<key3>[\\w]+)?:(?<value3>[\\w]+)?,?',
    multiple: true,
    values: {
      key3: 'defaultKey3',
      value3: 'defaultValue3'
    }
  }
}

let message = ''
const customDebugFn = (...args) => {
  message += args.join(' ') // + '\n'
}

const myArgs = new Reargs(params, {
  longShortDelimiter: ', ',
  paramDescriptionSpacer: ' '
}, customDebugFn)

describe('Advanced usage, multiple occurrences', () => {
  it('should be able to parse multiple key:value arguments', () => {
    const unparsable = myArgs.parse(['-e', 'key1:value1', '-e', 'key2:value2', '-e', 'key3:', '-e', ':value4'])

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')

    assert.deepEqual(myArgs.getAllValues(), {
      key: [
        'key1',
        'key2',
        'key3',
        'defaultKey'
      ],
      value: [
        'value1',
        'value2',
        'defaultValue',
        'value4'
      ]
    })
  })

  it('should be able to parse multiple key:value within a single argument', () => {
    const unparsable = myArgs.parse(['-a', 'key0:value0,key1:value2', '-a', 'key1:value1,key2:value2,key3:,:value4'])

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')

    assert.deepEqual(myArgs.getAllValues(), {
      key2: [
        'key1',
        'key2',
        'key3',
        'defaultKey2'
      ],
      value2: [
        'value1',
        'value2',
        'defaultValue2',
        'value4'
      ]
    })
  })

  it('should be able to do both', () => {
    const unparsable = myArgs.parse(['-b', 'key0:value0,key1:value2', '-b', 'key1:value1,key2:value2,key3:,:value4'])

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')

    assert.deepEqual(myArgs.getAllValues(), {
      key3: [
        'key0',
        'key1',
        'key1',
        'key2',
        'key3',
        'defaultKey3'
      ],
      value3: [
        'value0',
        'value2',
        'value1',
        'value2',
        'defaultValue3',
        'value4'
      ]
    })
  })

  it('and mixing all together', () => {
    const unparsable = myArgs.parse(['-e', 'key1:value1', '-a', 'key0:value0,key1:value2', '-e', 'key2:value2', '-b', 'key0:value0,key1:value2', '-e', 'key3:', '-b', 'key1:value1,key2:value2,key3:,:value4', '-e', ':value4', '-a', 'key1:value1,key2:value2,key3:,:value4'])

    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')

    assert.deepEqual(myArgs.getAllValues(), {
      key: [
        'key1',
        'key2',
        'key3',
        'defaultKey'
      ],
      value: [
        'value1',
        'value2',
        'defaultValue',
        'value4'
      ],
      key2: [
        'key1',
        'key2',
        'key3',
        'defaultKey2'
      ],
      value2: [
        'value1',
        'value2',
        'defaultValue2',
        'value4'
      ],
      key3: [
        'key0',
        'key1',
        'key1',
        'key2',
        'key3',
        'defaultKey3'
      ],
      value3: [
        'value0',
        'value2',
        'value1',
        'value2',
        'defaultValue3',
        'value4'
      ]
    })

    assert.deepEqual(myArgs.getValue('kv1', 'key'), ['key1', 'key2', 'key3', 'defaultKey'])
    assert.deepEqual(myArgs.getValue('kv2'), {
      key2: [
        'key1',
        'key2',
        'key3',
        'defaultKey2'
      ],
      value2: [
        'value1',
        'value2',
        'defaultValue2',
        'value4'
      ]
    })
    assert.deepEqual(myArgs.getGroupValues('kv3'), {
      key3: [
        'key0',
        'key1',
        'key1',
        'key2',
        'key3',
        'defaultKey3'
      ],
      value3: [
        'value0',
        'value2',
        'value1',
        'value2',
        'defaultValue3',
        'value4'
      ]
    })
  })
})
