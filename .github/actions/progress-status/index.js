const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

function renderProgressBar(completed, total) {
  const progress = Math.floor((completed / total) * 20);
  const bar = "█".repeat(progress) + "░".repeat(20 - progress);
  return `[${bar}] ${((completed / total) * 100).toFixed(1)}%`;
}

async function run() {
  try {
    const totalSteps = parseInt(core.getInput("total_steps"));
    const completedSteps = parseInt(core.getInput("completed_steps"));

    if (isNaN(totalSteps) || isNaN(completedSteps)) {
      core.setFailed("Los valores de total_steps y completed_steps deben ser números.");
      return;
    }

    if (completedSteps > totalSteps) {
      core.setFailed("completed_steps no puede ser mayor que total_steps.");
      return;
    }

    const progressBar = renderProgressBar(completedSteps, totalSteps);

    // 📌 Forzar logs en tiempo real
    console.log("::echo::on");

    // 📌 Agregar anotación en tiempo real
    console.log(`::notice title=📊 Progreso del Workflow:: 🚀 ${progressBar}`);

    // 📌 Escribir en el "Summary" del workflow (se actualiza en tiempo real)
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (summaryFile) {
      fs.appendFileSync(summaryFile, `### 🚀 Progreso del Workflow\n\n${progressBar}\n\n`);
    }

    // 📌 Pequeño delay para asegurar que GitHub UI refresque
    await new Promise((resolve) => setTimeout(resolve, 1000));

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
