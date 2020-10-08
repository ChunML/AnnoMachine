export const convertIdStrToInt = (id: string) =>
  parseInt(id.toString().replace(/_[0-9]*/g, ''));
