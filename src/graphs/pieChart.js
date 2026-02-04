// Helper: pick a color
function randomColor(i) {
  const colors = [
    "#ff6384", "#36a2eb", "#ffcd56",
    "#4bc0c0", "#9966ff", "#ff9f40"
  ];
  return colors[i % colors.length];
}

// Helper: add percentage label to each slice
function addPieLabel(svg, angle, radius, text) {
  const cx = svg.viewBox.baseVal.width / 2;
  const cy = svg.viewBox.baseVal.height / 2;

  const x = cx + (radius / 1.5) * Math.cos(angle);
  const y = cy + (radius / 1.5) * Math.sin(angle);

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", x);
  label.setAttribute("y", y);
  label.setAttribute("font-size", "10");
  label.setAttribute("text-anchor", "middle");
  label.textContent = text;

  svg.appendChild(label);
}

// Main function: draw pie chart
export function drawPieChart(svg, skills) {

  const allowed = ["skill_go", "skill_js", "skill_html", "skill_git", "skill_docker", "skill_sql"];

  skills = skills.filter(s => allowed.includes(s.type));

  const width = svg.viewBox.baseVal.width;
  const height = svg.viewBox.baseVal.height;
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  const total = skills.reduce((sum, s) => sum + s.amount, 0);

  let startAngle = 0;

  skills.forEach((skill, i) => {
    const sliceAngle = (skill.amount / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z"
    ].join(" ");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", randomColor(i));
    svg.appendChild(path);

    // Add percentage label for this slice
    const midAngle = startAngle + sliceAngle / 2;
    const percent = ((skill.amount / total) * 100).toFixed(0) + "%";
    addPieLabel(svg, midAngle, radius, percent);

    startAngle = endAngle;
  });
}
