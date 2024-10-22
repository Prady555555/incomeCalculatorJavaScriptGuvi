let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

document
  .getElementById("transaction-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.querySelector('input[name="type"]:checked').value;

    if (description && amount) {
      const transaction = { id: Date.now(), description, amount, type };
      transactions.push(transaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      updateUI();
      clearFields();
    }
  });

function clearFields() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

function updateUI(filter = "all") {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  transactions
    .filter((transaction) => filter === "all" || transaction.type === filter)
    .forEach((transaction) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "flex",
        "justify-between",
        "p-4",
        "hover:bg-gray-100"
      );
      listItem.innerHTML = `
          <span>${transaction.description}: $${transaction.amount}</span>
          <span class="flex">
            <button class="text-green-600 mr-4 edit-btn" data-id="${transaction.id}">Edit</button>
            <button class="text-red-600 delete-btn" data-id="${transaction.id}">Delete</button>
          </span>
        `;
      list.appendChild(listItem);

      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

  document.getElementById("total-income").innerText = `$${totalIncome}`;
  document.getElementById("total-expense").innerText = `$${totalExpense}`;
  document.getElementById("net-balance").innerText = `$${
    totalIncome - totalExpense
  }`;

  attachDeleteAndEditHandlers();
}

function attachDeleteAndEditHandlers() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      transactions = transactions.filter(
        (transaction) => transaction.id !== id
      );
      localStorage.setItem("transactions", JSON.stringify(transactions));
      updateUI();
    });
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      const transaction = transactions.find((t) => t.id === id);
      document.getElementById("description").value = transaction.description;
      document.getElementById("amount").value = transaction.amount;
      document.querySelector(
        `input[value="${transaction.type}"]`
      ).checked = true;

      transactions = transactions.filter((t) => t.id !== id);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      updateUI();
    });
  });
}

document.querySelectorAll('input[name="filter"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    updateUI(this.value);
  });
});

document.getElementById("reset-btn").addEventListener("click", function () {
  transactions = [];
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
});

updateUI();
