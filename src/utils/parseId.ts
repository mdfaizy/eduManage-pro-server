export function parseId(value: any): number {
  const id = Number(value);
  if (!id || isNaN(id)) {
    throw { statusCode: 400, message: "Invalid id parameter" };
  }
  return id;
}
