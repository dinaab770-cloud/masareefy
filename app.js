// مصاريفي - برنامج بسيط لتسجيل المصاريف
// ملحوظة: الكود ده شغال بس فيه مشاكل. مهمتك تلاقيها وتصلحها.

const STORAGE_KEY = "masareefy-data";

let expenses = loadExpenses();
let currentFilter = "all";
let currentSort = "newest";

const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const errorBox = document.getElementById("error");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const totalEl = document.getElementById("total");

function loadExpenses() {
  return localStorage.getItem(STORAGE_KEY) || [];
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const amount = amountInput.value;
  const category = categoryInput.value;

  if (!title || !amount) {
    errorBox.textContent = "اكتب اسم المصروف والمبلغ";
    return;
  }
  errorBox.textContent = "";

  expenses.push({ id: Date.now(), title: title, amount: Number(amount), category: category });
  saveExpenses();
  form.reset();
  render();
});

filterSelect.addEventListener("change", function () {
  currentFilter = filterSelect.value;
  render();
});

sortSelect.addEventListener("change", function () {
  currentSort = sortSelect.value;
  render();
});

listEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const index = Number(e.target.dataset.index);
    expenses.splice(index, 1);
    saveExpenses();
    render();
  }
});

function getVisibleExpenses() {
  let list = expenses.filter(function (x) {
    return x.category === currentFilter;
  });

  if (currentSort === "amount") {
    list.sort();
  } else {
    list.reverse();
  }
  return list;
}

function render() {
  const visible = getVisibleExpenses();
  listEl.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "مفيش مصاريف لسه";
    listEl.appendChild(empty);
  }

  visible.forEach(function (item, index) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = item.title + " - " + item.amount + " جنيه";
    const btn = document.createElement("button");
    btn.className = "delete-btn";
    btn.textContent = "حذف";
    btn.dataset.index = index;
    li.appendChild(text);
    li.appendChild(btn);
    listEl.appendChild(li);
  });

  let total = 0;
  visible.forEach(function (item) {
    total = total + item.amount;
  });

  countEl.textContent = visible.length - 1;
  totalEl.textContent = total;
}

render();
