const Reargs = require('..')
const assert = require('assert').strict

const helpTemplate = `
Usage: grep [OPTION]... PATTERNS [FILE]...
Search for PATTERNS in each FILE.
Example: grep -i 'hello world' menu.h main.c
PATTERNS can contain multiple patterns separated by newlines.
{% for group,params in groups %}
{{group|title}}:
{%- for param in params %}
{% if param.hidden != true -%}
{{ param.humanReadable|padEnd(params.padding, params.prepadding, ' ')|safe }} {{param.help}}
{%- endif %}
{%- endfor %}
{% endfor %}
When FILE is '-', read standard input.  With no FILE, read '.' if
recursive, '-' otherwise.  With fewer than two FILEs, assume -h.
Exit status is 0 if any line is selected, 1 otherwise;
if any error occurs and -q is not given, the exit status is 2.

Report bugs to: bug-grep@gnu.org
GNU grep home page: <http://www.gnu.org/software/grep/>
General help using GNU software: <https://www.gnu.org/gethelp/>
`

const group1 = {
  extendedregexp: {
    short: '-E',
    long: '--extended-regexp',
    humanReadable: '-E, --extended-regexp',
    help: 'PATTERNS are extended regular expressions'
  },
  fixedstrings: {
    short: '-F',
    long: '--fixed-strings',
    humanReadable: '-F, --fixed-strings',
    help: 'PATTERNS are strings'
  },
  basicregexp: {
    short: '-G',
    long: '--basic-regexp',
    humanReadable: '-G, --basic-regexp',
    help: 'PATTERNS are basic regular expressions'
  },
  perlregexp: {
    short: '-P',
    long: '--perl-regexp',
    humanReadable: '-P, --perl-regexp',
    help: 'PATTERNS are Perl regular expressions'
  },
  regexpPATTERNS: {
    short: '-e(?<PATTERNS>[^\\ ]+)',
    long: '--regexp=(?<PATTERNS>[^\\ ]+)',
    humanReadable: '-e, --regexp=PATTERNS',
    help: 'use PATTERNS for matching'
  },
  fileFILE: {
    short: '-f=(?<FILE>[^\\ ]+)',
    long: '--file=(?<FILE>[^\\ ]+)',
    humanReadable: '-f, --file=FILE',
    help: 'take PATTERNS from FILE'
  },
  ignorecase: {
    short: '-i',
    long: '--ignore-case',
    humanReadable: '-i, --ignore-case',
    help: 'ignore case distinctions in patterns and data'
  },
  noignorecase: {
    long: '--no-ignore-case',
    humanReadable: '--no-ignore-case',
    help: 'do not ignore case distinctions (default)'
  },
  wordregexp: {
    short: '-w',
    long: '--word-regexp',
    humanReadable: '-w, --word-regexp',
    help: 'match only whole words'
  },
  lineregexp: {
    short: '-x',
    long: '--line-regexp',
    humanReadable: '-x, --line-regexp',
    help: 'match only whole lines'
  },
  nulldata: {
    short: '-z',
    long: '--null-data',
    humanReadable: '-z, --null-data',
    help: 'a data line ends in 0 byte, not newline'
  }
}

const group2 = {
  nomessages: {
    short: '-s',
    long: '--no-messages',
    humanReadable: '-s, --no-messages',
    help: 'suppress error messages'
  },
  invertmatch: {
    short: '-v',
    long: '--invert-match',
    humanReadable: '-v, --invert-match',
    help: 'select non-matching lines'
  },
  version: {
    short: '-V',
    long: '--version',
    humanReadable: '-V, --version',
    help: 'display version information and exit'
  },
  help: {
    long: '--help',
    humanReadable: '--help',
    help: 'display this help text and exit'
  }
}

const group3 = {
  maxcountNUM: {
    short: '-m(?<NUM>[0-9]+)',
    long: '--max-count=(?<NUM>[0-9]+)',
    humanReadable: '-m, --max-count=NUM',
    help: 'stop after NUM selected lines'
  },
  byteoffset: {
    short: '-b',
    long: '--byte-offset',
    humanReadable: '-b, --byte-offset',
    help: 'print the byte offset with output lines'
  },
  linenumber: {
    short: '-n',
    long: '--line-number',
    humanReadable: '-n, --line-number',
    help: 'print line number with output lines'
  },
  linebuffered: {
    long: '--line-buffered',
    humanReadable: '--line-buffered',
    help: 'flush output on every line'
  },
  withfilename: {
    short: '-H',
    long: '--with-filename',
    humanReadable: '-H, --with-filename',
    help: 'print file name with output lines'
  },
  nofilename: {
    short: '-h',
    long: '--no-filename',
    humanReadable: '-h, --no-filename',
    help: 'suppress the file name prefix on output'
  },
  labelLABEL: {
    long: '--label=(?<LABEL>[^\\ ]+)',
    humanReadable: '--label=LABEL',
    help: 'use LABEL as the standard input file name prefix'
  },
  onlymatching: {
    short: '-o',
    long: '--only-matching',
    humanReadable: '-o, --only-matching',
    help: 'show only nonempty parts of lines that match'
  },
  silent: {
    short: '-q',
    long: '--silent',
    humanReadable: '-q, --silent',
    help: 'suppress all normal output'
  },
  binaryfilesTYPE: {
    long: '--binary-files=(?<TYPE>[^\\ ]+)',
    humanReadable: '--binary-files=TYPE',
    help: 'assume that binary files are TYPE;\n' +
      "                               TYPE is 'binary', 'text', or 'without-match'"
  },
  text: {
    short: '-a',
    long: '--text',
    humanReadable: '-a, --text',
    help: 'equivalent to --binary-files=text'
  },
  I: {
    short: '-I',
    humanReadable: '-I',
    help: 'equivalent to --binary-files=without-match'
  },
  directoriesACTION: {
    short: '-d(?<ACTION>(read|recurse|skip))',
    long: '--directories=(?<ACTION>(read|recurse|skip))',
    humanReadable: '-d, --directories=ACTION',
    help: 'how to handle directories;\n' +
      "                               ACTION is 'read', 'recurse', or 'skip'"
  },
  devicesACTION: {
    short: '-D(?<ACTION>(read|recurse|skip))',
    long: '--devices=(?<ACTION>(read|recurse|skip))',
    humanReadable: '-D, --devices=ACTION',
    help: 'how to handle devices, FIFOs and sockets;\n' +
      "                               ACTION is 'read' or 'skip'"
  },
  recursive: {
    short: '-r',
    long: '--recursive',
    humanReadable: '-r, --recursive',
    help: 'like --directories=recurse'
  },
  dereferencerecursive: {
    short: '-R',
    long: '--dereference-recursive',
    humanReadable: '-R, --dereference-recursive',
    help: 'likewise, but follow all symlinks'
  },
  includeGLOB: {
    long: '--include=(?<GLOB>[^\\ ]+)',
    humanReadable: '--include=GLOB',
    help: 'search only files that match GLOB (a file pattern)'
  },
  excludeGLOB: {
    long: '--exclude=(?<GLOB>[^\\ ]+)',
    humanReadable: '--exclude=GLOB',
    help: 'skip files that match GLOB'
  },
  excludefromFILE: {
    long: '--exclude-from=(?<FILE>[^\\ ]+)',
    humanReadable: '--exclude-from=FILE',
    help: 'skip files that match any file pattern from FILE'
  },
  excludedirGLOB: {
    long: '--exclude-dir=(?<GLOB>[^\\ ]+)',
    humanReadable: '--exclude-dir=GLOB',
    help: 'skip directories that match GLOB'
  },
  fileswithoutmatch: {
    short: '-L',
    long: '--files-without-match',
    humanReadable: '-L, --files-without-match',
    help: 'print only names of FILEs with no selected lines'
  },
  fileswithmatches: {
    short: '-l',
    long: '--files-with-matches',
    humanReadable: '-l, --files-with-matches',
    help: 'print only names of FILEs with selected lines'
  },
  count: {
    short: '-c',
    long: '--count',
    humanReadable: '-c, --count',
    help: 'print only a count of selected lines per FILE'
  },
  initialtab: {
    short: '-T',
    long: '--initial-tab',
    humanReadable: '-T, --initial-tab',
    help: 'make tabs line up (if needed)'
  },
  null: {
    short: '-Z',
    long: '--null',
    humanReadable: '-Z, --null',
    help: 'print 0 byte after FILE name'
  }
}

const group4 = {
  beforecontextNUM: {
    short: '-B(?<NUM>[0-9]+)',
    long: '--before-context=(?<NUM>[0-9]+)',
    humanReadable: '-B, --before-context=NUM',
    help: 'print NUM lines of leading context'
  },
  aftercontextNUM: {
    short: '-A(?<NUM>[0-9]+)',
    long: '--after-context=(?<NUM>[0-9]+)',
    humanReadable: '-A, --after-context=NUM',
    help: 'print NUM lines of trailing context'
  },
  contextNUM: {
    short: '-C(?<NUM>[0-9]+)',
    long: '--context=(?<NUM>[0-9]+)',
    humanReadable: '-C, --context=NUM',
    help: 'print NUM lines of output context'
  },
  NUM: {
    short: '-(?<NUM>[0-9]+)',
    humanReadable: '-NUM',
    help: 'same as --context=NUM'
  },
  colorWHEN: {
    long: '--color=?(?<WHEN>(always|never|auto))?',
    humanReadable: '--color[=WHEN]',
    help: ','
  },
  colourWHEN: {
    long: '--colour=?(?<WHEN>(always|never|auto))?',
    humanReadable: '--colour[=WHEN]',
    help: 'use markers to highlight the matching strings;\n' +
      "                            WHEN is 'always', 'never', or 'auto'"
  },
  binary: {
    short: '-U',
    long: '--binary',
    humanReadable: '-U, --binary',
    help: 'do not strip CR characters at EOL (MSDOS/Windows)'
  }
}

const groupNames = [
  'Pattern selection and interpretation',
  'Miscellaneous',
  'Output control',
  'Context control'
]

for (const [key, value] of Object.entries(group1)) {
  group1[key] = Object.assign({}, {
    ...value,
    group: groupNames[0]
  })
}

for (const [key, value] of Object.entries(group2)) {
  group2[key] = Object.assign({}, {
    ...value,
    group: groupNames[1]
  })
}

for (const [key, value] of Object.entries(group3)) {
  group3[key] = Object.assign({}, {
    ...value,
    group: groupNames[2]
  })
}

for (const [key, value] of Object.entries(group4)) {
  group4[key] = Object.assign({}, {
    ...value,
    group: groupNames[3]
  })
}

let message = ''
const customDebugFn = (...args) => {
  message += args.join(' ') + '\n'
}

const myArgs = new Reargs({
  ...group1,
  ...group2,
  ...group3,
  ...group4
}, {
  longShortDelimiter: ', ',
  paramDescriptionSpacer: ' '
}, customDebugFn)

describe('Parsing a multi group CLI like grep', () => {
  it('should be able to parse a pattern option', () => {
    const unparsable = myArgs.parse(['-z', '-P', '--regexp=foo', '-f=-'])

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(myArgs.getValue('regexpPATTERNS', 'PATTERNS'), 'foo')
    assert.deepEqual(myArgs.getGroupValues(groupNames[0]), {
      FILE: '-',
      PATTERNS: 'foo',
      basicregexp: false,
      extendedregexp: false,
      fixedstrings: false,
      ignorecase: false,
      lineregexp: false,
      noignorecase: false,
      nulldata: true,
      perlregexp: true,
      wordregexp: false
    })
    assert.deepEqual(myArgs.getAllValues(), {
      FILE: '-',
      I: false,
      NUM: false,
      PATTERNS: 'foo',
      aftercontextNUM: false,
      basicregexp: false,
      beforecontextNUM: false,
      binary: false,
      binaryfilesTYPE: false,
      byteoffset: false,
      colorWHEN: false,
      colourWHEN: false,
      contextNUM: false,
      count: false,
      dereferencerecursive: false,
      devicesACTION: false,
      directoriesACTION: false,
      excludeGLOB: false,
      excludedirGLOB: false,
      excludefromFILE: false,
      extendedregexp: false,
      fileswithmatches: false,
      fileswithoutmatch: false,
      fixedstrings: false,
      help: false,
      ignorecase: false,
      includeGLOB: false,
      initialtab: false,
      invertmatch: false,
      labelLABEL: false,
      linebuffered: false,
      linenumber: false,
      lineregexp: false,
      maxcountNUM: false,
      nofilename: false,
      noignorecase: false,
      nomessages: false,
      null: false,
      nulldata: true,
      onlymatching: false,
      perlregexp: true,
      recursive: false,
      silent: false,
      text: false,
      version: false,
      withfilename: false,
      wordregexp: false
    })
  })

  it('should be able to parse one option of each group', () => {
    const unparsable = myArgs.parse(['-i', '-s', '-q', '-50'])

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')

    assert.deepEqual(myArgs.getGroupValues(groupNames[0]), {
      fileFILE: false,
      regexpPATTERNS: false,
      basicregexp: false,
      extendedregexp: false,
      fixedstrings: false,
      ignorecase: true,
      lineregexp: false,
      noignorecase: false,
      nulldata: false,
      perlregexp: false,
      wordregexp: false
    })
    assert.deepEqual(myArgs.getGroupValues(groupNames[1]), {
      help: false,
      invertmatch: false,
      nomessages: true,
      version: false
    })
    assert.deepEqual(myArgs.getGroupValues(groupNames[2]), {
      I: false,
      binaryfilesTYPE: false,
      byteoffset: false,
      count: false,
      dereferencerecursive: false,
      devicesACTION: false,
      directoriesACTION: false,
      excludeGLOB: false,
      excludedirGLOB: false,
      excludefromFILE: false,
      fileswithmatches: false,
      fileswithoutmatch: false,
      includeGLOB: false,
      initialtab: false,
      labelLABEL: false,
      linebuffered: false,
      linenumber: false,
      maxcountNUM: false,
      nofilename: false,
      null: false,
      onlymatching: false,
      recursive: false,
      silent: true,
      text: false,
      withfilename: false
    })
    assert.deepEqual(myArgs.getGroupValues(groupNames[3]), {
      NUM: '50',
      aftercontextNUM: false,
      beforecontextNUM: false,
      binary: false,
      colorWHEN: false,
      colourWHEN: false,
      contextNUM: false
    })
  })

  it('should be able to parse positional parameters', () => {
    const unparsable = myArgs.parse(['-i', '-s', '-q', '-50', 'for', 'test.js'])

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, 'for\x00test.js')
    assert.strictEqual(myArgs.remain, '')
  })

  it('should be able to parse positional parameters with spaces', () => {
    const unparsable = myArgs.parse(['-i', '-s', '-q', '-50', 'for[^ ]', 'test with space.js'])

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, 'for[^ ]\x00test with space.js')
    assert.strictEqual(myArgs.remain, '')
  })

  it('should be able to generate help with a custom template', () => {
    const help = myArgs.generateHelp({}, helpTemplate)

    console.log(help)
  })
})
