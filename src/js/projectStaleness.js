
export default function projectStaleness (lastUpDate, target = 1) {
  let daysAgo = (Date.now() - lastUpDate.getTime()) / 1000 / 60 / 60 / 24;
  // magic coefficient that shapes the staleness curve
  // experimentally determined!!!
  let stalenessCoeff = 1 / (2.4 * Math.pow(target, 0.7));
  // generate a 1/(sqrt(x)+1)-type curve with some fiddly awesomeness
  let staleness = (Math.pow((stalenessCoeff * daysAgo) + 1, -1)) /
                  ((stalenessCoeff * Math.sqrt(daysAgo)) + 1);
  return staleness;
}
