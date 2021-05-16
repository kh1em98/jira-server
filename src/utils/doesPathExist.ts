export function doesPathsExist(selections: any, paths: string[]): boolean {
  if (!selections) {
    return false;
  }

  for (const path of paths) {
    const node = selections.find((x: any) => x.name.value === path);
    if (!node) return false;
  }

  return true;
}
