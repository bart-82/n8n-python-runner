const fs = require("fs");

const path = "/etc/n8n-task-runners.json";
const cfg = JSON.parse(fs.readFileSync(path, "utf8"));

if (!Array.isArray(cfg["task-runners"])) {
  throw new Error("Invalid config: missing task-runners array");
}

for (const r of cfg["task-runners"]) {
  if (r["runner-type"] === "python") {
    r["env-overrides"] = r["env-overrides"] || {};
    r["env-overrides"]["N8N_RUNNERS_STDLIB_ALLOW"] = "*";
    r["env-overrides"]["N8N_RUNNERS_EXTERNAL_ALLOW"] = "*";

    // importantissimo: devono essere consentite tra le env “passabili”
    r["allowed-env"] = Array.isArray(r["allowed-env"]) ? r["allowed-env"] : [];
    for (const v of ["N8N_RUNNERS_STDLIB_ALLOW", "N8N_RUNNERS_EXTERNAL_ALLOW"]) {
      if (!r["allowed-env"].includes(v)) r["allowed-env"].push(v);
    }
  }

  if (r["runner-type"] === "javascript") {
    r["env-overrides"] = r["env-overrides"] || {};
    // opzionale: sblocca import JS (se ti serve)
    // r["env-overrides"]["NODE_FUNCTION_ALLOW_BUILTIN"] = "*";
    // r["env-overrides"]["NODE_FUNCTION_ALLOW_EXTERNAL"] = "*";

    // opzionale: se sblocchi sopra, aggiungi anche allowed-env
    // r["allowed-env"] = Array.isArray(r["allowed-env"]) ? r["allowed-env"] : [];
    // for (const v of ["NODE_FUNCTION_ALLOW_BUILTIN", "NODE_FUNCTION_ALLOW_EXTERNAL"]) {
    //   if (!r["allowed-env"].includes(v)) r["allowed-env"].push(v);
    // }
  }
}

fs.writeFileSync(path, JSON.stringify(cfg, null, 2));
console.log("Patched /etc/n8n-task-runners.json successfully");
