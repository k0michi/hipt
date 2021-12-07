export function parse(text) {
  const lines = text.split('\n');
  const root = { children: [] };
  const depthStack = [-1];
  const nodeStack = [root];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine == '') {
      continue;
    }

    const depth = getDepth(line);
    const node = { value: trimmedLine, children: [] };

    if (depth > depthStack[depthStack.length - 1]) {
      nodeStack[nodeStack.length - 1].children.push(node);
      depthStack.push(depth);
      nodeStack.push(node);
    } else if (depth == depthStack[depthStack.length - 1]) {
      nodeStack[nodeStack.length - 2].children.push(node);
      nodeStack[nodeStack.length - 1] = node;
    } else if (depth < depthStack[depthStack.length - 1]) {
      while (depth != depthStack[nodeStack.length - 1]) {
        depthStack.pop();
        nodeStack.pop();
      }

      nodeStack[nodeStack.length - 2].children.push(node);
      nodeStack[nodeStack.length - 1] = node;
    }
  }

  return root;
}

function getDepth(line) {
  const result = line.match(/^\s+/);
  let indent;

  if (result != null) {
    indent = result[0].length;
  } else {
    indent = 0;
  }

  return indent;
}