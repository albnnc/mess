import { ast, mongo, parser } from "./deps.ts";

export function mongoizeFiql<T = unknown>(fiql: string) {
  if (!fiql) {
    return {};
  }
  const parsed = parser.parse(fiql) as ast.Node;
  const convert = (node: ast.Node): Record<string, unknown> => {
    if (ast.isComparisonNode(node)) {
      return node.operator === "=="
        ? { [node.left.selector]: node.right.value }
        : {
            [node.left.selector]: {
              ["$" + node.operator.slice(1, -1)]: node.right.value,
            },
          };
    }
    if (ast.isLogicNode(node)) {
      const operator = {
        [ast.OR]: "or",
        [ast.OR_VERBOSE]: "or",
        [ast.AND]: "and",
        [ast.AND_VERBOSE]: "and",
      }[node.operator];
      if (!operator) {
        throw new Error("Unknown logic operator");
      }
      return {
        ["$" + operator]: [convert(node.left), convert(node.right)],
      };
    }
    return {};
  };
  return convert(parsed) as mongo.Filter<T>;
}
