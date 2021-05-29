const Reargs = require('..')
const assert = require('assert').strict

const template = `
Usage: grep [OPTION]... PATTERNS [FILE]...
Search for PATTERNS in each FILE.
Example: grep -i 'hello world' menu.h main.c
PATTERNS can contain multiple patterns separated by newlines.

{%- for group,params in groups %}
{% for param in params %}
{% if param.hidden != true -%}
{{ param.humanReadable|padEnd(params.padding, params.prepadding, ' ')|safe }} {{param.help}}
{%- endif %}
{%- endfor %}
{% endfor -%}

Output control:
  -m, --max-count=NUM       stop after NUM selected lines
  -b, --byte-offset         print the byte offset with output lines
  -n, --line-number         print line number with output lines
      --line-buffered       flush output on every line
  -H, --with-filename       print file name with output lines
  -h, --no-filename         suppress the file name prefix on output
      --label=LABEL         use LABEL as the standard input file name prefix
  -o, --only-matching       show only nonempty parts of lines that match
  -q, --quiet, --silent     suppress all normal output
      --binary-files=TYPE   assume that binary files are TYPE;
                            TYPE is 'binary', 'text', or 'without-match'
  -a, --text                equivalent to --binary-files=text
  -I                        equivalent to --binary-files=without-match
  -d, --directories=ACTION  how to handle directories;
                            ACTION is 'read', 'recurse', or 'skip'
  -D, --devices=ACTION      how to handle devices, FIFOs and sockets;
                            ACTION is 'read' or 'skip'
  -r, --recursive           like --directories=recurse
  -R, --dereference-recursive  likewise, but follow all symlinks
      --include=GLOB        search only files that match GLOB (a file pattern)
      --exclude=GLOB        skip files that match GLOB
      --exclude-from=FILE   skip files that match any file pattern from FILE
      --exclude-dir=GLOB    skip directories that match GLOB
  -L, --files-without-match  print only names of FILEs with no selected lines
  -l, --files-with-matches  print only names of FILEs with selected lines
  -c, --count               print only a count of selected lines per FILE
  -T, --initial-tab         make tabs line up (if needed)
  -Z, --null                print 0 byte after FILE name

Context control:
  -B, --before-context=NUM  print NUM lines of leading context
  -A, --after-context=NUM   print NUM lines of trailing context
  -C, --context=NUM         print NUM lines of output context
  -NUM                      same as --context=NUM
      --color[=WHEN],
      --colour[=WHEN]       use markers to highlight the matching strings;
                            WHEN is 'always', 'never', or 'auto'
  -U, --binary              do not strip CR characters at EOL (MSDOS/Windows)

When FILE is '-', read standard input.  With no FILE, read '.' if
recursive, '-' otherwise.  With fewer than two FILEs, assume -h.
Exit status is 0 if any line is selected, 1 otherwise;
if any error occurs and -q is not given, the exit status is 2.

Report bugs to: bug-grep@gnu.org
GNU grep home page: <http://www.gnu.org/software/grep/>
General help using GNU software: <https://www.gnu.org/gethelp/>
`

const group2 = 'Miscellaneous'
const part2 = {
  noMessages: {
    group: group2,
    short: '-s',
    long: '--no-messages',
    help: 'suppress error messages'
  },
  invertMatch: {
    group: group2,
    short: '-v',
    long: '--invert-match',
    help: 'select non-matching lines'
  },
  version: {
    group: group2,
    short: '-V',
    long: '--version',
    help: 'display version information and exit',
    stopParse: true
  },
  help: {
    group: group2,
    long: '--help',
    help: 'display this help text and exit'
  }
}

const group1 = 'Pattern selection and interpretation'
const part1 = {
  extendedRegExp: {
    group: group1,
    short: '-E',
    long: '--extended-regexp',
    help: 'PATTERNS are extended regular expressions'
  },
  fixedStrings: {
    group: group1,
    short: '-F',
    long: '--fixed-strings',
    help: 'PATTERNS are strings'
  },
  basicRegExp: {
    group: group1,
    short: '-G',
    long: '--basic-regexp',
    help: 'PATTERNS are basic regular expressions'
  },
  perlRegExp: {
    group: group1,
    short: '-P',
    long: '--perl-regexp',
    help: 'PATTERNS are Perl regular expressions'
  },
  re: {
    group: group1,
    short: '-e[=| ](?<pattern>[^\\ ]+)',
    long: '--regexp[=|](?<pattern>[^\\ ]+)',
    help: 'use PATTERNS for matching'
  },
  file: {
    group: group1,
    short: '-f[=| ](?<file>[^\\ ]+)',
    long: '--file[=| ](?<file>[^\\ ]+)',
    help: 'take PATTERNS from FILE'
  },
  ignoreCase: {
    group: group1,
    short: '-i',
    long: '--ignore-case',
    help: 'ignore case distinctions in patterns and data'
  },
  noIgnoreCase: {
    group: group1,
    long: '--no-ignore-case',
    help: 'do not ignore case distinctions (default)'
  },
  wordRegExp: {
    group: group1,
    short: '-w',
    long: '--word-regexp',
    help: 'match only whole words'
  },
  lineRegExp: {
    group: group1,
    short: '-x',
    long: '--line-regexp',
    help: 'match only whole lines'
  },
  nullData: {
    group: group1,
    short: '-z',
    long: '--null-data',
    help: 'a data line ends in 0 byte, not newline'
  }
}

let message = ''
const customDebugFn = (...args) => {
  message += args.join(' ') + '\n'
}

const myArgs = new Reargs({... part1}, {
  longShortDelimiter: ', ',
  paramDescriptionSpacer: ' '
}, customDebugFn)

describe('Parsing a multi group CLI like grep', () => {
  it('should be able to parse a pattern option', () => {
    const unparsable = myArgs.parse(['-z', '-P', '--regexp=foo', '-f', '-'])

    // assert.strictEqual(message, '')
    assert.strictEqual(unparsable, '')
    assert.strictEqual(myArgs.remain, '')
    assert.strictEqual(myArgs.getValue('re', 'pattern'), 'foo')
    assert.deepEqual(myArgs.getGroupValues(group1), {
      basicRegExp: false,
      extendedRegExp: false,
      file: '-',
      fixedStrings: false,
      ignoreCase: false,
      lineRegExp: false,
      noIgnoreCase: false,
      nullData: true,
      pattern: 'foo',
      perlRegExp: true,
      wordRegExp: false
    })
    assert.deepEqual(myArgs.getAllValues(), {
      basicRegExp: false,
      extendedRegExp: false,
      file: '-',
      fixedStrings: false,
      ignoreCase: false,
      lineRegExp: false,
      noIgnoreCase: false,
      nullData: true,
      pattern: 'foo',
      perlRegExp: true,
      wordRegExp: false
    })
  })
})
