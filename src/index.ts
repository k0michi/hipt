export interface Node {
  children: Node[];
  value?: string;
}

export function parse(text: string) {
  const lines = text.split('\n');
  const root: Node = { children: [] };
  const depthStack: number[] = [-1];
  const nodeStack: Node[] = [root];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine == '') {
      continue;
    }

    const depth = getDepth(line);
    const node: Node = { value: trimmedLine, children: [] };

    if (depth > depthStack[depthStack.length - 1]) {
      nodeStack[nodeStack.length - 1].children.push(node);
      depthStack.push(depth);
      nodeStack.push(node);
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