export function arrayInArray(a, aOfA, k) {
  for (var i = k; i < aOfA.length; i++) {
    if (_.isEqual(a, aOfA[i])) {
      return i;
    }
  }
  return -1;
}

export function gramToColor(gram) {
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
    return -1;
  } else {
    return 1;
  }
}

export function abxCompare(a, b) {
  return a.name.localeCompare(b.name);
}

export function abxNarrowToBroad(a, b) {
  if (a.bugs.length < b.bugs.length) {
    return -1;
  } else if (a.bugs.length > b.bugs.length) {
    return 1;
  } else {
    return a.name.localeCompare(b.name);
  }
}

export function infxnCompare(a, b) {
  return a.name.localeCompare(b.name);
}
