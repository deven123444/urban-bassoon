const planDefaults = {
  Starter: { ram: 2 },
  Survival: { ram: 6 },
  Network: { ram: 12 }
};

const addons = {
  backups: { label: "Daily backups" },
  priority: { label: "Priority support" },
  dedicatedIp: { label: "Dedicated IP" }
};

const form = document.querySelector("#server-form");
const serverName = document.querySelector("#serverName");
const plan = document.querySelector("#plan");
const gameType = document.querySelector("#gameType");
const ram = document.querySelector("#ram");
const ramOutput = document.querySelector("#ramOutput");
const total = document.querySelector("#total");
const summaryPlan = document.querySelector("#summaryPlan");
const summaryRam = document.querySelector("#summaryRam");
const summaryAddons = document.querySelector("#summaryAddons");
const githubRepo = document.querySelector("#githubRepo");
const issueLink = document.querySelector("#issueLink");

function checkedAddons() {
  return Object.entries(addons)
    .filter(([id]) => document.querySelector(`#${id}`).checked)
    .map(([, addon]) => addon);
}

function issueBody() {
  const selectedAddons = checkedAddons().map((addon) => `- ${addon.label}`).join("\n") || "- None";
  return [
    "New free server request",
    "",
    `Server name: ${serverName.value || "Untitled server"}`,
    `Plan: ${plan.value}`,
    `Game type: ${gameType.value}`,
    `RAM: ${ram.value} GB`,
    "Access: Free",
    "",
    "Add-ons:",
    selectedAddons,
    "",
    "Player count, location, version, and modpack notes:"
  ].join("\n");
}

function cleanRepo(value) {
  return value.trim().replace(/^https:\/\/github\.com\//, "").replace(/\/issues.*$/, "").replace(/\/$/, "");
}

function updateSummary() {
  const selectedAddons = checkedAddons();
  const repo = cleanRepo(githubRepo.value);
  const title = encodeURIComponent(`Server request: ${serverName.value || plan.value}`);
  const body = encodeURIComponent(issueBody());

  ramOutput.value = ram.value;
  total.textContent = "Free";
  summaryPlan.textContent = plan.value;
  summaryRam.textContent = `${ram.value} GB`;
  summaryAddons.textContent = selectedAddons.map((addon) => addon.label).join(", ") || "None";
  issueLink.href = `https://github.com/${repo}/issues/new?title=${title}&body=${body}&labels=order`;
  localStorage.setItem("blockhostRepo", repo);
}

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    const nextPlan = link.dataset.plan;
    plan.value = nextPlan;
    ram.value = planDefaults[nextPlan].ram;
    updateSummary();
  });
});

plan.addEventListener("change", () => {
  ram.value = planDefaults[plan.value].ram;
  updateSummary();
});

form.addEventListener("input", updateSummary);
githubRepo.addEventListener("input", updateSummary);

const savedRepo = localStorage.getItem("blockhostRepo");
if (savedRepo) {
  githubRepo.value = savedRepo;
}

updateSummary();
