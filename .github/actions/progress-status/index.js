const core = require("@actions/core");

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
    core.info(`Progreso del workflow: ${progressBar}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
