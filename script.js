const levers = [
    "Control & Customization",
    "Data Transparency & Ownership",
    "Total Cost of Ownership",
    "Talent & Resource Burden",
    "Speed & Agility",
    "Channel & Innovation Breadth",
    "Risk, Compliance & Brand Safety"
];

const tbody = document.getElementById("table-body");

// Create table rows and inputs
levers.forEach(lever => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${lever}</td>
      <td><input type="number" min="0" max="5" class="importance" /></td>
      <td><input type="number" min="0" max="5" class="performance" /></td>
      <td><input type="text" class="weighted" readonly /></td>
      <td><input type="text" class="gap" readonly /></td>
    `;
    tbody.appendChild(row);
});

// Attach input event listeners after DOM is built
document.querySelectorAll('.importance, .performance').forEach(input => {
    input.addEventListener('input', recalculate);
});

function recalculate() {
    let totalImportance = 0;
    let totalPerformance = 0;
    let totalGap = 0;
    let allFilled = true;
    let valid = true;

    document.querySelectorAll("#table-body tr").forEach(row => {
        const impInput = row.querySelector(".importance");
        const perfInput = row.querySelector(".performance");
        const imp = parseFloat(impInput.value);
        const perf = parseFloat(perfInput.value);

        // Reset validation state
        impInput.classList.remove("error");
        perfInput.classList.remove("error");

        // Validation
        if (isNaN(imp) || isNaN(perf)) {
            allFilled = false;
            return;
        }

        if (imp < 0 || imp > 5) {
            impInput.classList.add("error");
            valid = false;
        }

        if (perf < 0 || perf > 5) {
            perfInput.classList.add("error");
            valid = false;
        }

        const weighted = imp * perf;
        const gap = (imp * 5) - weighted;

        row.querySelector(".weighted").value = weighted.toFixed(1);
        row.querySelector(".gap").value = gap.toFixed(1);

        totalImportance += imp;
        totalPerformance += perf;
        totalGap += gap;
    });

    document.getElementById("total-importance").textContent = totalImportance.toFixed(1);
    document.getElementById("total-performance").textContent = totalPerformance.toFixed(1);
    document.getElementById("total-gap").textContent = totalGap.toFixed(1);

    const resultText = document.getElementById("gap-analysis");
    resultText.className = "result-text"; // Reset any previous styles

    if (!allFilled || !valid) {
        resultText.textContent = "";
        return;
    }

    if (totalGap <= 20) {
        resultText.textContent = "Aligned with priorities";
        resultText.classList.add("green");
    } else if (totalGap <= 35) {
        resultText.textContent = "Mixed fit – target weak spots";
        resultText.classList.add("orange");
    } else {
        resultText.textContent = "Major misalignment – consider structural changes";
        resultText.classList.add("red");
    }
}

// Reset button clears everything
document.getElementById("reset-button").addEventListener("click", () => {
    document.querySelectorAll("#table-body input").forEach(input => {
        input.value = "";
        input.classList.remove("error");
    });
    document.getElementById("total-importance").textContent = "0";
    document.getElementById("total-performance").textContent = "0";
    document.getElementById("total-gap").textContent = "0";
    document.getElementById("gap-analysis").textContent = "";
});
