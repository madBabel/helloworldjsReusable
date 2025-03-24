const core = require("@actions/core");
const fs = require("fs");

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

    const progressBar = renderProgressBar(completedSteps, totalSteps);
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;

    if (summaryFile) {
      fs.appendFileSync(summaryFile, `### 🚀 Progreso del Workflow\n\n${progressBar}\n\n`);
    }

    console.log(`::notice title=📊 Progreso:: ${progressBar}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
