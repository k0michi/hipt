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
});

function equalParseResult(string: string, node: index.Node) {
  const parsed = index.parse(string);
  return assert.deepStrictEqual(parsed, node);
}

function node(value?: string, ...children: index.Node[]): index.Node {
  if (value == undefined) {
    return { children };
  }

  return { value, children };
}