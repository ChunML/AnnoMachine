export const convertIdStrToInt = id =>
  parseInt(id.toString().replace(/_[0-9]*/g, ''));
