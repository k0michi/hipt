export interface Node {
  children: Node[];
  // A root node doesn't have value
  value?: string;
}

export interface ParseOptions {
  deepenIf: (value: string) => boolean;
}

export function parse(text: string, options: ParseOptions = { deepenIf: (value: string) => true }) {
  const lines = text.split('\n');
  const root: Node = { children: [] };
  const depthStack: number[] = [-1];
  const nodeStack: Node[] = [root];

  for (const line of lines) {
    const trimmedLine = line.trim();

    const depth = getDepth(line);
    const node: Node = { value: trimmedLine, children: [] };

    // If line is empty
    if (trimmedLine == '') {
      if (nodeStack.length >= 2) {
        nodeStack[nodeStack.length - 2].children.push(node);
        nodeStack[nodeStack.length - 1] = node;
      }

      continue;
    }

    if (depth > depthStack[depthStack.length - 1]) {
      const parent = nodeStack[nodeStack.length - 1];
      const parentDepth = depthStack[depthStack.length - 1];
      let shouldDeepen = true;

      if (parent.value != null) {
        shouldDeepen = options.deepenIf(parent.value);
      }

      if (shouldDeepen) {
        nodeStack[nodeStack.length - 1].children.push(node);
        depthStack.push(depth);
        nodeStack.push(node);
      } else {
        node.value = line.substring(parentDepth);
        nodeStack[nodeStack.length - 2].children.push(node);
        nodeStack[nodeStack.length - 1] = node;
      }
    } else if (depth == depthStack[depthStack.length - 1]) {
      nodeStack[nodeStack.length - 2].children.push(node);
      nodeStack[nodeStack.length - 1] = node;
    } else if (depth < depthStack[depthStack.length - 1]) {
      while (depth != depthStack[depthStack.length - 1]) {
        depthStack.pop();
        nodeStack.pop();

        if (depthStack.length == 1) {
          throw new Error('Syntax error');
        }
      }

      nodeStack[nodeStack.length - 2].children.push(node);
      nodeStack[nodeStack.length - 1] = node;
    }
  }

  return root;
}

function getDepth(line: string) {
  const result = line.match(/^\s+/);
  let indent;

  if (result != null) {
    indent = result[0].length;
  } else {
    indent = 0;
  }

  return indent;
}

export function stringify(node: Node, indent: string = '  ') {
  const isRoot = node.value == undefined;
  let string = isRoot ? '' : node.value + '\n';

  for (const child of node.children) {
    if (isRoot) {
      string += stringify(child);
    } else {
      string += prefixEachLine(stringify(child), indent);
    }
  }

  return string;
}

function prefixEachLine(string: string, prefix: string) {
  // Empty lines remain the same
  return string.split('\n').map(l => l.length == 0 ? l : prefix + l).join('\n');
}