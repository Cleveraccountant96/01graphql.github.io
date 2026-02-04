// src/scripts/profile.js

import {
  graphqlRequest,
  GET_USER_INFO,
  GET_XP_TRANSACTIONS,
  GET_SKILLS,
  GET_RESULTS_WITH_USER
} from "../Graphql/queries.js";

import { drawXPGraph } from "../graphs/xpGraph.js";
import { drawSkillsGraph } from "../graphs/skillsGraph.js";
import { drawPieChart } from "../graphs/pieChart.js";

if (!localStorage.getItem("jwt")) {
  window.location.href = "./login.html";
}

document.getElementById("logout").onclick = () => {
  localStorage.removeItem("jwt");
  window.location.href = "./login.html";
};

async function loadProfile() {
  
  const userData = await graphqlRequest(GET_USER_INFO);
  const user = userData.user[0];

  document.getElementById("name").textContent =
    `${user.firstName} ${user.lastName}`;
  document.getElementById("login").textContent = `Login: ${user.login}`;
  document.getElementById("campus").textContent = `Campus: ${user.campus ?? "N/A"}`;
 
  // XP DATA
  const xpData = await graphqlRequest(GET_XP_TRANSACTIONS);
  const xpTransactions = xpData.transaction;

  // Total XP
  const totalXP = xpTransactions.reduce((sum, t) => sum + t.amount, 0);
  addInfo("Total XP", totalXP);

  // XP by project (top project)
  const xpByProject = {};
  xpTransactions.forEach(t => {
    const name = t.object?.name ?? "Unknown";
    xpByProject[name] = (xpByProject[name] || 0) + t.amount;
  });

  const topProject = Object.entries(xpByProject)
    .sort((a, b) => b[1] - a[1])[0];

  if (topProject) {
    addInfo("Top XP Project", `${topProject[0]} (${topProject[1]} XP)`);
  }

  // Draw XP graph
  const xpSvg = document.getElementById("xp-graph");
  drawXPGraph(xpSvg, xpTransactions);

  // SKILLS DATA

  const skillsData = await graphqlRequest(GET_SKILLS);
  const skillsSvg = document.getElementById("skills-graph");
  const pieSvg = document.getElementById("skills-pie");

  const aggregated = {};
  skillsData.transaction.forEach(s => {
    aggregated[s.type] = (aggregated[s.type] || 0) + s.amount;
  });

  const skills = Object.entries(aggregated).map(([type, amount]) => ({
    type,
    amount
  }));

  drawSkillsGraph(skillsSvg, skills);
  drawPieChart(pieSvg, skills);


  // 4) RESULTS (PASS/FAIL ONLY)
  
  const resultsData = await graphqlRequest(GET_RESULTS_WITH_USER);
  const results = resultsData.result;

  const pass = results.filter(r => r.grade >= 1).length;
  const fail = results.filter(r => r.grade === 0).length;
  const passRate = ((pass / (pass + fail)) * 100).toFixed(1);

  addInfo("Pass Rate", `${passRate}% (${pass} / ${fail})`);
}

// Helper to append info to user-info section
function addInfo(label, value) {
  const section = document.getElementById("user-info");
  const p = document.createElement("p");
  p.textContent = `${label}: ${value}`;
  section.appendChild(p);
}

loadProfile();
