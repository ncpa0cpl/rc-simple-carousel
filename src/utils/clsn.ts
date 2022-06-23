export const clsn = (...names: Array<string | undefined>) => {
  return names.filter((e) => e).join(" ");
};
