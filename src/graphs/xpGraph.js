// src/graphs/xpGraph.js

export function drawXPGraph(svg, transactions) {
  const width = svg.viewBox.baseVal.width;
  const height = svg.viewBox.baseVal.height;
  const padding = 40;

  let cumulativeXP = 0;
  const points = transactions.map((t, index) => {
    cumulativeXP += t.amount;
    return { x: index, y: cumulativeXP };
  });

  const maxXP = Math.max(...points.map(p => p.y));

  const scaleX = (i) =>
    padding + (i / (points.length - 1)) * (width - padding * 2);

  const scaleY = (v) =>
    height - padding - (v / maxXP) * (height - padding * 2);

  const polylinePoints = points
    .map((p, i) => `${scaleX(i)},${scaleY(p.y)}`)
    .join(" ");

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", polylinePoints);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "#4caf50");
  polyline.setAttribute("stroke-width", "2");
  svg.appendChild(polyline);

  // --- 1) XP point marker at the last point ---
  const last = points[points.length - 1];
  const lastX = scaleX(points.length - 1);
  const lastY = scaleY(last.y);

  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("cx", lastX);
  dot.setAttribute("cy", lastY);
  dot.setAttribute("r", 5);
  dot.setAttribute("fill", "#4caf50");
  dot.setAttribute("stroke", "#ffffff");
  dot.setAttribute("stroke-width", "2");
  svg.appendChild(dot);


  // --- 3) Total XP label in top-right corner ---
  const totalLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  totalLabel.setAttribute("x", width - padding);
  totalLabel.setAttribute("y", padding);
  totalLabel.setAttribute("text-anchor", "end");
  totalLabel.setAttribute("font-size", "14");
  totalLabel.textContent = `Total XP: ${last.y}`;
  svg.appendChild(totalLabel);
}
