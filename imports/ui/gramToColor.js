export function gramToColor(gram) {
  console.log("in gramToColor fxn: " + gram);
  if (gram > 0) {
    return "#663399";
  } else if (gram < 0) {
    return "#DDA0DD";
  } else {
    return "#696969";
  }
}
