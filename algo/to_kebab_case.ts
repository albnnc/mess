const regExp =
  /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

export function toKebabCase(data: string) {
  return data.match(regExp)?.join("-").toLowerCase() ?? data;
}
