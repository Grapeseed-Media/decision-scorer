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

// table rows and inputs
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

// input event listeners post DOM
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

        // Reset validation 
        impInput.classList.remove("error");
        perfInput.classList.remove("error");

        // validation
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
    resultText.className = "result-text";

    if (!allFilled || !valid) {
        resultText.textContent = "";
        return;
    }

    let message = "";
    if (totalGap <= 10) {
        resultText.classList.add("green");
        message = `<strong>🚀 Optimized</strong><br>
    <ul style="list-style: disc; text-align: left; display: inline-block; margin: 0; padding-left: 20px;">
      <li>Your operating model is tightly aligned to priorities.</li>
      <li>Keep current model; revisit every 6 mos.</li>
    </ul>`;
    } else if (totalGap <= 20) {
        resultText.classList.add("green");
        message = `<strong>🟢 Healthy</strong><br>
    <ul style="list-style: disc; text-align: left; display: inline-block; margin: 0; padding-left: 20px;">
      <li>Minor frictions exist but aren’t blocking growth.</li>
      <li>Tackle top 1–2 gaps with quick wins.</li>
    </ul>`;
    } else if (totalGap <= 30) {
        resultText.classList.add("yellow");
        message = `<strong>🟡 Mixed Fit</strong><br>
    <ul style="list-style: disc; text-align: left; display: inline-block; margin: 0; padding-left: 20px;">
      <li>Clear friction points are reducing ROI.</li>
      <li>Pilot a partner or tool to close biggest gap.</li>
    </ul>`;
    } else if (totalGap <= 40) {
        resultText.classList.add("orange");
        message = `<strong>🟠 Strained</strong><br>
    <ul style="list-style: disc; text-align: left; display: inline-block; margin: 0; padding-left: 20px;">
      <li>Misalignment is shaving margin / slowing scale.</li>
      <li>Build a 90-day improvement plan or test a hybrid partner.</li>
    </ul>`;
    } else {
        resultText.classList.add("red");
        message = `<strong>🔴 Critical</strong><br>
    <ul style="list-style: disc; text-align: left; display: inline-block; margin: 0; padding-left: 20px;">
      <li>Model is costing money, time, or performance.</li>
      <li>Fast-track a structural change (switch provider or in-house build).</li>
    </ul>`;
    }

    resultText.innerHTML = message;

}


// Reset button 
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
