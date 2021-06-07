/* eslint no-new: "off" */

const Reargs = require('..')
const assert = require('assert').strict

const isFunction = function (a) {
  return (!!a) && (a.constructor === Function)
}

describe('Instantiation of Rearg class', () => {
  it('should be able to instantiate without any parameter', () => {
    const noParam = new Reargs()
    assert.deepEqual(noParam.params, {})
    assert.deepEqual(noParam.groups, {})
    assert.strictEqual(isFunction(noParam.debug), true)
  })

  it('should accept only Object parameters', () => {
    assert.throws(() => {
      new Reargs([])
    },
    {
      name: 'TypeError',
      message: 'Parameters must be set by an object, got : []'
    })
  })

  it('should accept only Object (or null) as options', () => {
    assert.throws(() => {
      new Reargs({}, null)
      new Reargs({}, [])
    },
    {
      name: 'TypeError',
      message: 'Given options is not an Object ! We got: []'
    })
  })

  it('should accept a custom debug function', () => {
    let message = ''
    const customDebugFn = (...args) => {
      message += args.join(' ')
    }

    const test = new Reargs({}, null, customDebugFn)
    test.debug('this is a test message:', true)

    assert.strictEqual(message, 'this is a test message: true')
  })

  it('should not accept empty parameter', () => {
    assert.throws(() => {
      new Reargs({ foo: {} })
    },
    {
      name: 'TypeError',
      message: "Parameter 'foo' must have at least 'short' or 'long' properties set ! We got: {}"
    })
  })

  it('should accept only string or RegExp for short property', () => {
    let message = ''
    const customDebugFn = (...args) => {
      message += args.join(' ') // + '\n'
    }

    assert.throws(() => {
      new Reargs({ foo: { short: 'foo' }, bar: { short: 'bar' }, baz: { short: 'baz' } }, null, customDebugFn)
      new Reargs({ foo: { short: 'foo' }, bar: { short: 'bar' }, baz: { short: /baz/ } }, null, customDebugFn)
      new Reargs({ foo: { short: 'foo' }, bar: { short: 'bar' }, baz: { short: ['baz'] } }, null, customDebugFn)
    },
    {
      name: 'TypeError',
      message: "Parameter baz has an unsupported type for short property, we got: 'object' !"
    })

    assert.strictEqual(message, [
      'param: short of type string | _param: /\x00*foo(\x00|$)/ | _param.humanReadable: fooparam: short of type string | _param: /\x00*bar(\x00|$)/ | _param.humanReadable: barparam: short of type string | _param: /\x00*baz(\x00|$)/ | _param.humanReadable: bazparam: short of type string | _param: /\x00*foo(\x00|$)/ | _param.humanReadable: fooparam: short of type string | _param: /\x00*bar(\x00|$)/ | _param.humanReadable: barparam: short of type object | _param: /\x00*baz(\x00|$)/ | _param.humanReadable: bazparam: short of type string | _param: /\x00*foo(\x00|$)/ | _param.humanReadable: fooparam: short of type string | _param: /\x00*bar(\x00|$)/ | _param.humanReadable: bar'
    ].join('\n'))
  })

  it('should accept only string or RegExp for long property', () => {
    let message = ''
    const customDebugFn = (...args) => {
      message += args.join(' ') // + '\n'
    }

    assert.throws(() => {
      new Reargs({ foo: { long: 'foo' }, bar: { long: 'bar' }, baz: { long: 'baz' } }, null, customDebugFn)
      new Reargs({ foo: { long: 'foo' }, bar: { long: 'bar' }, baz: { long: /baz/ } }, null, customDebugFn)
      new Reargs({ foo: { long: 'foo' }, bar: { long: 'bar' }, baz: { long: ['baz'] } }, null, customDebugFn)
    },
    {
      name: 'TypeError',
      message: "Parameter baz has an unsupported type for long property, we got: 'object' !"
    })

    assert.strictEqual(message, [
      'param: long of type string | _param: /\x00*foo(\x00|$)/ | _param.humanReadable: fooparam: long of type string | _param: /\x00*bar(\x00|$)/ | _param.humanReadable: barparam: long of type string | _param: /\x00*baz(\x00|$)/ | _param.humanReadable: bazparam: long of type string | _param: /\x00*foo(\x00|$)/ | _param.humanReadable: fooparam: long of type string | _param: /\x00*bar(\x00|$)/ | _param.humanReadable: barparam: long of type object | _param: /\x00*baz(\x00|$)/ | _param.humanReadable: bazparam: long of type string | _param: /\x00*foo(\x00|$)/ | _param.humanReadable: fooparam: long of type string | _param: /\x00*bar(\x00|$)/ | _param.humanReadable: bar'
    ].join('\n'))
  })

  it('should not accept bad context when asked to generate help', () => {
    assert.throws(() => {
      const test = new Reargs({ foo: { short: 'foo' } })
      test.generateHelp([])
    },
    {
      name: 'TypeError',
      message: 'contextHelp must be an object if set ! We got: []'
    })
  })
  // it('should support grouping of options', () => {
  //
  // })
})
