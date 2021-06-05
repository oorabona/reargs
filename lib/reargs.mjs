/* eslint prefer-named-capture-group: "off" */
'use strict';

import pick from 'lodash/pick';
import nunjucks from 'nunjucks';
import {
  inspect
} from 'util';

const nunjucksEnv = new nunjucks.Environment()

const defaultHelpTemplate = `
{{name}} v{{version}} - {{description}} - by {{author|safe}}

Usage:
  {{name}}{% for group,params in groups %} [{{ group }}]{% endfor %}

{% for group,params in groups %}
{{group|title}}s:
{% for param in params %}
{% if param.hidden != true -%}
{{ param.humanReadable|padEnd(params.padding, params.prepadding, opts.paramDescriptionSpacer)|safe }} {{param.help}}
{%- endif %}
{%- endfor %}
{% endfor -%}
`

nunjucksEnv.addFilter('padEnd', (str, padding = 0, prepadding = 0, char = '.') => {
  const lines = str.split('\n')
  let lastLineLength = lines[0].length

  if (lines.length > 1) {
    lastLineLength = lines[1].length
  }

  const output = str.padEnd(padding + str.length - lastLineLength + 1, char)
  return output.padStart(prepadding + output.length, ' ')
})

const isObject = function(a) {
  return (!!a) && (a.constructor === Object);
};

const isArray = function(a) {
  return (!!a) && (a.constructor === Array);
};

const isFunction = function(a) {
  return (!!a) && (a.constructor === Function);
};

export default class Reargs {

  /**
   * constructor - Entrypoint for initializing Reargs
   *
   * @param {object}  [params={}]   Parameters configuration
   * @param {object}  [opts=null]   Options
   * @param {function|boolean} [debug=false]   either disable/enable default debug function or provide your own
   *
   * @returns {Reargs} Instance of the class
   */
  constructor(params = {}, opts = null, debug = false) {
    this.params = {}
    this.groups = {}
    this.debug = !!debug ? (isFunction(debug) ? debug : console.debug) : () => {}

    if (opts !== null && !isObject(opts)) {
      throw new TypeError(`Given options is not an Object ! We got: ${inspect(opts)}`)
    }

    this.opts = Object.assign({}, {
      longShortDelimiter: '\n',
      paramDescriptionSpacer: '.',
      prePaddingSpaces: 2,
      alignLongIfNoShort: 4,
      exitOnStop: false,
      ...opts
    })

    if (!this.setup(params)) {
      throw new TypeError(this.error)
    }
  }

  /**
   * setup - Perform checks on parameters and normalize when needed
   *
   * @param {object} params Contains all parameters and their configuration
   *
   * @returns {boolean} Whether it went fine (true) or not (false)
   */
  setup(params) {
    if (!isObject(params)) {
      this.error = `Parameters must be set by an object, got : ${inspect(params)}`

      return false
    }

    for (const id in params) {
      if (!this.set(id, params[id])) {
        return false
      }
    }

    return true
  }

  /**
   * set - Do the actual normalization and type checking on paramters configuration
   *
   * @param {string} id    Parameter name
   * @param {object} param Parameter configuration
   *
   * @returns {boolean} Whether it went fine (true) or not (false)
   */
  set(id, param) {
    const _param = Object.assign({}, {
      stopParse: false,
      values: false,
      group: '_',
      multiple: false,
      ...param
    })

    // Must have at least one of them
    const typeOfShort = typeof(_param.short)
    const typeOfLong = typeof(_param.long)
    if (typeOfShort === 'undefined' && typeOfLong === 'undefined') {
      this.error = `Parameter '${id}' must have at least 'short' or 'long' properties set ! We got: ${inspect(param)}`
      return false
    }

    /*
     * Normalize parameter properties, three possibilities :
     * 1) If it is a string, we convert it to RegExp
     * 2) If it is already a RegExp, do nothing
     * 3) Otherwise it is unsupported
     *
     * In all cases, add a human readable representation for help
     */
    const humanReadableArray = []

    const types = {
      short: typeOfShort,
      long: typeOfLong
    }

    for (const pType of ['short', 'long']) {
      if (types[pType] !== 'undefined') {
        const pCurrent = _param[pType].toString()

        if (typeof(_param.captureMultiple) === 'string') {
          _param.captureMultiple = new RegExp(_param.captureMultiple)
        }

        if (types[pType] === 'string') {
          if (_param.captureMultiple instanceof RegExp) {
            _param[pType] = new RegExp(pCurrent)
          } else {
            _param[pType] = new RegExp(`\\s*${pCurrent}(\\s|$)`)
          }
        }

        if (!(_param[pType] instanceof RegExp)) {
          this.error = `Parameter ${id} has an unsupported type for ${pType} property, we got: '${types[pType]}' !`
          return false
        }

        const humanReadable = pCurrent.replace(/\(\?<(\w+)>[^)]*\)/g, '<$1>').replace(/\//g, '')
        humanReadableArray.push(humanReadable)

        this.debug(`param: ${pType} of type ${types[pType]} | _param: ${_param[pType]} | _param.humanReadable: ${humanReadable}`)
      }
    }

    // If there is already a human readable property set, do not overwrite.
    // Otherwise create that "human readable" string from our own representation
    const {
      longShortDelimiter
    } = this.opts

    if (typeof(_param.humanReadable) === 'undefined') {
      _param.humanReadable = humanReadableArray.join(longShortDelimiter)
    }

    if (types.short === 'undefined') {
      _param.humanReadable = _param.humanReadable.padStart(this.opts.alignLongIfNoShort + _param.humanReadable.length)
    }

    /*
     * If 'group' feature is used, i.e grouping of parameters
     * then reformat the human readable version so that it is ready for output.
     */
    if (typeof(_param.group) !== 'string') {
      _param.group = '_'
    }

    if (typeof(this.groups[_param.group]) === 'undefined') {
      this.groups[_param.group] = []
      this.groups[_param.group].padding = 0
      this.groups[_param.group].prepadding = this.opts.prePaddingSpaces
    }

    this.groups[_param.group].push(pick(_param, ['help', 'humanReadable', 'hidden']))

    const lines = _param.humanReadable.split('\n')
    let maxLength = lines[0].length
    if (lines.length > 1 && lines[1].length > lines[0].length) {
      maxLength = lines[1].length
    }

    // compute padding required to align humanReadable params
    if (this.groups[_param.group].padding < maxLength) {
      this.groups[_param.group].padding = maxLength + 1
    }

    // Save this param
    this.params[id] = _param

    return true
  }


  /**
   * reset - Reset definitive answers structure by reinitializing with defafult values
   *
   * @returns Nothing
   */
  reset() {
    this.askfor = {}
    this.remain = ''
    for (const askforId in this.params) {
      let values = {}

      // we do not set a default value if we are expecting multiple occurrences
      if (!this.params[askforId].multiple && !this.params[askforId].captureMultiple) {
        values = this.params[askforId].values
      }

      this.askfor[askforId] = {
        values
      }
    }
  }

  /**
   * __checkArg - Find if given `arg` matches rule `askforId` according to its
   * `currentParam` parameters. If matches, store the values if capturing groups
   * were enabled, otherwise set to true
   *
   * @param {string} arg                    Argument to match
   * @param {string} askforId               Rule name
   * @param {object} currentParam           Rule parameters
   * @param {number} [allowStartingIndex=0] Acceptable starting index to evaluate matching rule
   *
   * @returns {boolean} Returns true if match, false otherwise
   */
  __checkArg(arg, askforId, currentParam, allowStartingIndex = 0) {
    let resultFound = false
    const hasCaptureMulti = currentParam.captureMultiple instanceof RegExp

    const cleanExistingValues = !currentParam.multiple

    for (const pType of ['short', 'long']) {
      /*
       * check if we have groups, and get the group names values in that case
       * if we do not have groups, then we default to a basic boolean flag
       */
      if (currentParam[pType] instanceof RegExp) {
        let currentRegExp = currentParam[pType]

        let done = false
        let firstRound = true

        while (!done) {
          const matchGroups = currentRegExp.exec(arg)

          this.debug(`arg='${arg}' pType='${pType}' re='${currentRegExp.toString()}' matchGroups='${matchGroups}'`)

          if (matchGroups !== null && matchGroups.index <= allowStartingIndex) {
            const matchResult = pick(matchGroups, ['index', 'input'])
            matchResult.temp = matchGroups[0]

            if (hasCaptureMulti && isObject(this.askfor[askforId].result)) {
              this.askfor[askforId].result.temp = this.askfor[askforId].result.temp.concat(matchResult.temp)
            } else {
              this.askfor[askforId].result = matchResult
            }
            // console.log(inspect(matchGroups))
            // console.log(inspect(this.askfor[askforId].result))
            // do we have named capturing groups ?
            if (matchGroups.groups) {
              let defaultValues = {}

              // do we have default values ?
              if (isObject(currentParam.values)) {
                defaultValues = currentParam.values
              }

              // if we do not want to handle multiple values, we need to reset
              // resulting values to empty, otherwise keep what already exist
              if (isObject(this.askfor[askforId].values)) {
                // console.log('first round ?', firstRound, 'cleanExistingValues', cleanExistingValues)
                if (firstRound && cleanExistingValues) {
                  // console.debug('reset values', currentParam.multiple, hasCaptureMulti)
                  this.askfor[askforId].values = {}
                } else {
                  // console.log('values kept as is', inspect(this.askfor[askforId].values))
                }
              } else {
                // console.log('setup values for', askforId, inspect(this.askfor[askforId].values))
                this.askfor[askforId].values = {}
              }
              firstRound = false

              // merge the contents of currently evaluated regex with what is
              // already stored in the result object
              for (const [key, value] of Object.entries(matchGroups.groups)) {
                const newValue = value || defaultValues[key]
                if (currentParam.multiple || hasCaptureMulti) {
                  // console.log('this.askfor[askforId].values[key]', this.askfor[askforId].values[key], newValue)
                  this.askfor[askforId].values[key] = (this.askfor[askforId].values[key] || []).concat(newValue)
                } else {
                  this.askfor[askforId].values[key] = newValue
                }
              }
            } else if (!hasCaptureMulti) {
              // console.log('there is no group !', matchGroups)
              this.askfor[askforId].values = true
            }

            resultFound = true

            arg = arg.slice(matchGroups.index + matchGroups[0].length)

            if (hasCaptureMulti) {
              currentRegExp = currentParam.captureMultiple
            } else {
              done = true
            }
          } else {
            done = true
          }
        }
        if (isObject(this.askfor[askforId].result)) {
          this.askfor[askforId].result.found = this.askfor[askforId].result.temp
          if (hasCaptureMulti) {
            this.askfor[askforId].result.temp = ''
          }
        }
      } else {
        this.debug(`currentParam[pType] = ${inspect(currentParam[pType])}`)
      }
    }

    return resultFound
  }

  /**
   * parse - Parse command line arguments
   *
   * @param {array} args Array of arguments (typically process.argv.slice(2))
   *
   * @returns {string} everything not parsed will be left in `remain` and returned to caller
   */
  parse(args) {
    if (!isArray(args)) {
      throw new TypeError(`Given arguments list is not an Array ! We got: ${inspect(args)}`)
    }

    this.args = args
    let _args = args.join(' ')
    this.reset()

    // To optimize parsing, start by identifying parameters tagged with 'stopParse'
    // Since we are asked to stop parsing after these parameters, if either of them
    // is found, we can just discard the rest of the command line parameters ...
    let minIndex = _args.length
    let lengthOfStopParameter = 0
    let lastAskfor = {}

    for (const askforId in this.params) {
      const currentParam = this.params[askforId]

      if (currentParam.stopParse) {
        const hasMatched = this.__checkArg(_args, askforId, currentParam, _args.length)

        if (hasMatched) {
          const {
            index
          } = this.askfor[askforId].result
          if (index < minIndex) {
            minIndex = index
            lengthOfStopParameter = this.askfor[askforId].result.found.length

            // and if exitOnStop flag is set, we save this for later and act
            // as if only the first stopping parameter is parsed
            if (this.opts.exitOnStop) {
              lastAskfor = Object.assign({}, this.askfor)
              this.reset()
            }
          }
        }
      }
    }

    // Remove everything after the first stopParse parameter, and move everything
    // sliced to this.remain, if we have sliced something ...
    if (minIndex !== _args.length) {
      this.remain = _args.slice(minIndex + lengthOfStopParameter)
      _args = _args.slice(0, minIndex)

      // if this flag is set, we return immediately with the appropriate askfor
      // structure with only this stopping parameter evaluated
      if (this.opts.exitOnStop) {
        this.askfor = lastAskfor
        return _args
      }
    }

    let _last_round_args = _args
    let done = false

    while (!done) {

      for (const askforId in this.params) {
        const currentParam = this.params[askforId]

        this.debug(`_args is now : ${inspect(_args)}`)

        if (!currentParam.stopParse) {
          const hasMatched = this.__checkArg(_args, askforId, currentParam)

          if (hasMatched) {
            // remove match from arguments string
            const {
              found
            } = this.askfor[askforId].result

            this.debug(`before slice _args : ${inspect(_args)} found : ${inspect(found)}`)
            _args = _args.replace(found, '')
            this.debug(`after slice _args : ${inspect(_args)}`)
          }
        }
      }

      // trim left and right to keep only what matters
      _args = _args.trim()
      if (_args !== _last_round_args) {
        _last_round_args = _args
      } else {
        done = true
      }
    }

    // store remaining arguments that could not be parsed
    return _args
  }

  /**
   * getValue - Get value(s) for specific `askforId` parameter
   *
   * @param {string} askforId    Parameter rule name
   * @param {string} [captureGroupName=null] If capture groups are used, we can retrieve directly from the group name
   *
   * @returns {object|string} The value, which can be either an object, a string or null
   *
   * More specifically, return null if either parameter rule name or capture group name
   * do not exist.
   */
  getValue(askforId, captureGroupName = null) {
    if (!isObject(this.askfor[askforId])) {
      return null
    }

    const {
      values
    } = this.askfor[askforId]
    if (captureGroupName === null) {
      return values
    }

    if (isArray(values) || isObject(values)) {
      return values[captureGroupName]
    }

    return null
  }

  /**
   * getGroupValues - Get all values from a specific parameters group including
   * default values if such attributes have been defined
   *
   * @param {string} group Group name to retrieve values from
   *
   * @returns {object} All group values
   */
  getGroupValues(group) {
    const result = {}
    let askforIds = []

    if (group === null) {
      askforIds = Object.keys(this.params)
    } else {
      for (const [key, param] of Object.entries(this.params)) {
        if (param.group === group) {
          askforIds.push(key)
        }
      }
    }

    askforIds.forEach((askforId) => {
      const {
        values
      } = this.askfor[askforId]
      this.debug(`param = ${inspect(askforId)} values = ${inspect(values)}`)

      if (isObject(values)) {
        Object.assign(result, this.askfor[askforId].values)
      } else {
        result[askforId] = values
      }
    })

    return result
  }

  /**
   * getAllValues - Get all values, including default values
   *
   * @returns {object} Pairs of parameters and their values
   */
  getAllValues() {
    return this.getGroupValues(null)
  }

  /**
   * generateHelp - Generate help from template rendered with context and parameters
   *
   * @param {object}  [contextHelp={}]         Additionnal user defined context
   * @param {string}  [templateSource=defaultHelpTemplate] Template source (nunjucks compatible)
   *
   * @returns {string} Generated help, ready to be printed out anywhere !
   */
  generateHelp(contextHelp = {}, templateSource = defaultHelpTemplate) {
    if (!isObject(contextHelp)) {
      throw new TypeError(`contextHelp must be an object if set ! We got: ${inspect(contextHelp)}`)
    }

    const {
      opts,
      params,
      groups
    } = this
    const helpContext = Object.assign({}, {
      name: 'Your app',
      version: '0.0.0',
      description: 'This description needs to be customized !',
      author: 'John Doe',
      ...contextHelp,
      params,
      opts,
      groups
    })

    const helpTemplate = new nunjucks.Template(templateSource, nunjucksEnv)
    this.debug('helpContext:', helpContext)

    return helpTemplate.render(helpContext)
  }
}
