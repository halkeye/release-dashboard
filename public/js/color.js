// from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Based on http://stackoverflow.com/questions/17525215/calculate-color-values-from-green-to-red
// convert a number to a color using hsl
// *i* is a number between 0 and 1. Full red is 0, full green is 1.
function numberToColorHsl(i) {
  // get a hue somewhere between red and green
  const hue = i * 120 / 360;
  // tweak the following two lines to get the right tone/shade
  const saturation = 0.7;
  const lightness = 0.92;
  const rgb = hslToRgb(hue, saturation, lightness);
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

export { numberToColorHsl };
