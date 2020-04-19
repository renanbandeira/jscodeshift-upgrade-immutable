function transformMergeFunctions(j, root, mergeFunction = 'merge') {
    const callExpressions = root.find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: mergeFunction },
      },
    }
  );

  callExpressions.replaceWith(nodePath => {
      const { node } = nodePath;
      const object = j.callExpression(j.identifier('fromJS'),
                                      node.arguments)
      node.arguments = [object];
      return node;
    });
  return root;
}

function transformMergeInOrWithFunctions(j, root, mergeFunction = 'mergeIn') {
    const callExpressions = root.find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: mergeFunction },
      },
    }
  );

  callExpressions.replaceWith(nodePath => {
      const { node } = nodePath;
      const object = j.callExpression(j.identifier('fromJS'),
                                      [node.arguments[1]])
      node.arguments = [node.arguments[0], object];
      return node;
    });
  return root;
}

function getFirstNodePath (j, root){
  return root.find(j.Program).get('body', 0);
}

function getFirstNode (j, root){
  return getFirstNodePath(j, root).node;
}


// Press ctrl+space for code completion
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  let root = j(file.source);

  const immutableImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'immutable',
    },
  });

  if (immutableImportDeclaration.size() > 0) {
    immutableImportDeclaration.replaceWith(nodePath => {
      const { node } = nodePath;
      node.specifiers.push(j.importSpecifier(j.identifier('fromJS')));
      return node;
    });
  } else {
    const firstNode = getFirstNode(j, root);
    const firstComments = firstNode.comments;
	if (firstComments.length > 0) {
      delete firstNode.comments;
		root.find(firstNode.type).replaceWith(j.importDeclaration([j.importSpecifier(j.identifier('fromJS'))],
                            j.literal('immutable')));
      const immutableImport = getFirstNode(j, root);
      root.find(immutableImport.type).insertAfter(firstNode)
      immutableImport.comments = firstComments;

    } else {
      j(root.find(j.ImportDeclaration).at(0).get())
	    .insertBefore("import { fromJS } from 'immutable'")
    }
  }

  ['merge', 'mergeDeep'].forEach((mergeFunction) => {
    root = transformMergeFunctions(j, root, mergeFunction);
  });

    ['mergeIn', 'mergeDeepIn', 'mergeWith', 'mergeDeepWith'].forEach((mergeFunction) => {
    root = transformMergeInOrWithFunctions(j, root, mergeFunction);
  });

  return root.toSource({ quote: 'single' });
}
