import * as assert from 'assert';
import * as index from './index';

describe('index', () => {
  it('should handle empty string', () => {
    equalParseResult('', node(undefined));
  });

  it('should handle one line', () => {
    equalParseResult('abc', node(undefined, node('abc')));
  });

  it('should handle multiple lines', () => {
    equalParseResult(
      `abc
  def`, node(undefined, node('abc', node('def'))));
  });

  it('should handle complex string 1', () => {
    equalParseResult(
      `abc
  def
  ghi`, node(undefined,
        node('abc',
          node('def'),
          node('ghi')
        )
      )
    );
  });

  it('should handle complex string 2', () => {
    equalParseResult(
      `abc
  def
    ghi`, node(undefined,
        node('abc',
          node('def',
            node('ghi')
          )
        )
      )
    );
  });

  it('should handle complex string 3', () => {
    equalParseResult(
      `abc
  def
    ghi
      jkl
    mno`, node(undefined,
        node('abc',
          node('def',
            node('ghi',
              node('jkl')
            ),
            node('mno')
          )
        )
      )
    );
  });

  it('should handle tab characters', () => {
    equalParseResult(
      `abc
\tdef
\t\tghi
\t\t\tjkl
\t\tmno`, node(undefined,
        node('abc',
          node('def',
            node('ghi',
              node('jkl')
            ),
            node('mno')
          )
        )
      )
    );
  });

  it('should raise an exception', () => {
    assert.throws(() =>
      index.parse(
        `abc
  def
    ghi
      jkl
   mno`
      ),
      { message: 'Syntax error' });
  });

  it('should handle empty line 1', () => {
    equalParseResult(
      `abc
  def
    ghi
    
    jkl
    mno`, node(undefined,
        node('abc',
          node('def',
            node('ghi'),
            node(''),
            node('jkl'),
            node('mno')
          )
        )
      )
    );
  });

  it('should handle empty line 2', () => {
    equalParseResult(
      `abc
  def
    ghi
    
      jkl
    mno`, node(undefined,
        node('abc',
          node('def',
            node('ghi'),
            node('', node('jkl')),
            node('mno')
          )
        )
      )
    );
  });

  it('should be able to stringify', () => {
    equalStringifyResult(
      node(undefined,
        node('abc',
          node('def',
            node('ghi',
              node('jkl')
            ),
            node('mno')
          )
        )
      ),
      `abc
  def
    ghi
      jkl
    mno
`
    );
  });
});

function equalParseResult(string: string, node: index.Node) {
  const parsed = index.parse(string);
  return assert.deepStrictEqual(parsed, node);
}

function equalStringifyResult(node: index.Node, string: string) {
  const stringified = index.stringify(node);
  return assert.equal(stringified, string);
}

function node(value?: string, ...children: index.Node[]): index.Node {
  if (value == undefined) {
    return { children };
  }

  return { value, children };
}