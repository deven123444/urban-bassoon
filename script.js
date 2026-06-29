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

function checkedAddons() {
  return Object.entries(addons)
    .filter(([id]) => document.querySelector(`#${id}`).checked)
    .map(([, addon]) => addon);
}

function updateSummary() {
  const selectedAddons = checkedAddons();

  ramOutput.value = ram.value;
  total.textContent = "Free";
  summaryPlan.textContent = plan.value;
  summaryRam.textContent = `${ram.value} GB`;
  summaryAddons.textContent = selectedAddons.map((addon) => addon.label).join(", ") || "None";
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

updateSummary();
