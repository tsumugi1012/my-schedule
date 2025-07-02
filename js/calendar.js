const monthLabel = document.getElementById('monthLabel');
const calendarBody = document.getElementById('calendarBody');
const scheduleInput = document.getElementById('scheduleInput');
const diaryInput = document.getElementById('diaryInput');
const moodIcons = document.querySelectorAll('.mood-icon');
const budgetInput = document.getElementById('budgetInput');
const expenseInput = document.getElementById('expenseInput');
const incomeInput = document.getElementById('incomeInput');
const balanceDisplay = document.getElementById('balanceDisplay');

let currentDate = new Date();
let selectedDateStr = '';

function updateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthLabel.textContent = `${year}年${month + 1}月`;
  calendarBody.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let row = document.createElement('tr');
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }

  for (let date = 1; date <= lastDate; date++) {
    if (row.children.length === 7) {
      calendarBody.appendChild(row);
      row = document.createElement('tr');
    }

    const cell = document.createElement('td');
    cell.textContent = date;

    const dateStr = `${year}-${month + 1}-${date}`;

    cell.addEventListener('click', () => {
      selectedDateStr = dateStr;
      loadInputs();
    });

    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      window.location.href = 'schedule.html?date=' + dateStr;
    });

    row.appendChild(cell);
  }

  calendarBody.appendChild(row);
}

function loadInputs() {
  scheduleInput.value = localStorage.getItem(`${selectedDateStr}-schedule`) || '';
  diaryInput.value = localStorage.getItem(`${selectedDateStr}-diary`) || '';
  budgetInput.value = localStorage.getItem(`${selectedDateStr}-budget`) || '';
  expenseInput.value = localStorage.getItem(`${selectedDateStr}-expense`) || '';
  incomeInput.value = localStorage.getItem(`${selectedDateStr}-income`) || '';
  const mood = localStorage.getItem(`${selectedDateStr}-mood`);
  moodIcons.forEach(icon => {
    icon.classList.remove('selected');
    if (icon.dataset.mood === mood) {
      icon.classList.add('selected');
    }
  });
  calculateBalance();
}

function saveInputs() {
  if (!selectedDateStr) return;
  localStorage.setItem(`${selectedDateStr}-schedule`, scheduleInput.value);
  localStorage.setItem(`${selectedDateStr}-diary`, diaryInput.value);
  localStorage.setItem(`${selectedDateStr}-budget`, budgetInput.value);
  localStorage.setItem(`${selectedDateStr}-expense`, expenseInput.value);
  localStorage.setItem(`${selectedDateStr}-income`, incomeInput.value);
}

function calculateBalance() {
  const budget = Number(budgetInput.value || 0);
  const expense = Number(expenseInput.value || 0);
  const income = Number(incomeInput.value || 0);
  const result = budget - expense + income;
  balanceDisplay.textContent = `差額: ${result}円`;
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

scheduleInput.addEventListener('input', saveInputs);
diaryInput.addEventListener('input', saveInputs);
budgetInput.addEventListener('input', () => { saveInputs(); calculateBalance(); });
expenseInput.addEventListener('input', () => { saveInputs(); calculateBalance(); });
incomeInput.addEventListener('input', () => { saveInputs(); calculateBalance(); });

moodIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    moodIcons.forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    localStorage.setItem(`${selectedDateStr}-mood`, icon.dataset.mood);
  });
});

updateCalendar();
