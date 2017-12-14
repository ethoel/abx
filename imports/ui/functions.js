export function gramToColor(gram) {
  //console.log("in gramToColor fxn: " + gram);
  if (gram > 0) {
    return "#663399";
  } else if (gram < 0) {
    return "#DDA0DD";
  } else {
    return "#696969";
  }
}

export function bugCompare(a, b) {
  if (a.gram === b.gram) {
    return a.name.localeCompare(b.name);
  } else if (a.gram === 1 || (a.gram === -1 && b.gram === 0)) {
    return 1;
  } else {
    return -1;
  }
}

export function abxCompare(a, b) {
  return a.name.localeCompare(b.name);
}

export function infxnCompare(a, b) {
  return a.name.localeCompare(b.name);
}
