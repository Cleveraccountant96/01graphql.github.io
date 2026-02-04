// src/graphs/skillsGraphs.js

export function drawSkillsGraph(svg, skills) {
  // Only show selected skills
  const allowed = ["skill_go", "skill_js", "skill_html", "skill_git", "skill_docker", "skill_sql"];
  skills = skills.filter(s => allowed.includes(s.type));

  const width = svg.viewBox.baseVal.width;
  const height = svg.viewBox.baseVal.height;
  const padding = 40; // a bit more padding for labels

  const total = skills.reduce((sum, s) => sum + s.amount, 0);
  const max = Math.max(...skills.map(s => s.amount));
  const barWidth = (width - padding * 2) / skills.length;

  skills.forEach((skill, i) => {
    const barHeight = (skill.amount / max) * (height - padding * 3);

    const x = padding + i * barWidth;
    const y = height - padding - barHeight;

    // Bar
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth - 8);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", randomColor(i));
    svg.appendChild(rect);

    // Percentage (above bar)
    const percent = ((skill.amount / total) * 100).toFixed(0) + "%";
    const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    percentText.setAttribute("x", x + (barWidth - 8) / 2);
    percentText.setAttribute("y", y - 5);
    percentText.setAttribute("text-anchor", "middle");
    percentText.setAttribute("font-size", "10");
    percentText.textContent = percent;
    svg.appendChild(percentText);

    // Label (under bar)
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", x + (barWidth - 8) / 2);
    labelText.setAttribute("y", height - padding + 15);
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("font-size", "10");
    labelText.textContent = prettyLabel(skill.type);
    svg.appendChild(labelText);
  });
}

function randomColor(i) {
  const colors = [
    "#ff6384", "#36a2eb", "#ffcd56",
    "#4bc0c0", "#9966ff", "#ff9f40"
  ];
  return colors[i % colors.length];
}

function prettyLabel(type) {
  const map = {
    skill_go: "Go",
    skill_js: "JavaScript",
    skill_html: "HTML",
    skill_git: "Git",
    skill_docker: "Docker",
    skill_sql: "SQL"
  };
  return map[type] || type.replace("skill_", "").toUpperCase();
}
