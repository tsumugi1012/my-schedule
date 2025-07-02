'use strict';

const periodLabel = document.getElementById('periodLabel');
const avgWake = document.getElementById('avgWake');
const avgSleep = document.getElementById('avgSleep');
const totalExpense = document.getElementById('totalExpense');
const totalIncome = document.getElementById('totalIncome');
const avgExpensePerDay = document.getElementById('avgExpensePerDay');

const weeklyBtn = document.getElementById('weeklyBtn');
const monthlyBtn = document.getElementById('monthlyBtn');
const prevPeriodBtn = document.getElementById('prevPeriod');
const nextPeriodBtn = document.getElementById('nextPeriod');
const expenseWeekBtn = document.getElementById('expenseWeekBtn');
const expenseMonthBtn = document.getElementById('expenseMonthBtn');

let currentDate = new Date();
let viewMode = 'week';
let expenseMode = 'week';

weeklyBtn.addEventListener('click', () => {
  viewMode = 'week';
  updateButtons();
  updateSummary();
});

monthlyBtn.addEventListener('click', () => {
  viewMode = 'month';
  updateButtons();
  updateSummary();
});

expenseWeekBtn.addEventListener('click', () => {
  expenseMode = 'week';
  updateButtons();
  updateSummary();
});

expenseMonthBtn.addEventListener('click', () => {
  expenseMode = 'month';
  updateButtons();
  updateSummary();
});

prevPeriodBtn.addEventListener('click', () => {
  if (viewMode === 'week') currentDate.setDate(currentDate.getDate() - 7);
  else currentDate.setMonth(currentDate.getMonth() - 1);
  updateSummary();
});

nextPeriodBtn.addEventListener('click', () => {
  if (viewMode === 'week') currentDate.setDate(currentDate.getDate() + 7);
  else currentDate.setMonth(currentDate.getMonth() + 1);
  updateSummary();
});

function updateButtons() {
  weeklyBtn.classList.toggle('active', viewMode === 'week');
  monthlyBtn.classList.toggle('active', viewMode === 'month');
  expenseWeekBtn.classList.toggle('active', expenseMode === 'week');
  expenseMonthBtn.classList.toggle('active', expenseMode === 'month');
}

function getPeriodDates(mode) {
  const dates = [];
  const base = new Date(currentDate);
  if (mode === 'week') {
    const start = new Date(base.setDate(base.getDate() - base.getDay()));
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
  } else {
    const year = base.getFullYear();
    const month = base.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      dates.push(new Date(year, month, i));
    }
  }
  return dates;
}

function updateSummary() {
  const dates = getPeriodDates(viewMode);
  const label = viewMode === 'week'
    ? `${dates[0].getMonth() + 1}/${dates[0].getDate()}〜${dates[6].getMonth() + 1}/${dates[6].getDate()}`
    : `${currentDate.getMonth() + 1}月`;
  periodLabel.textContent = label;

  let wakeTimes = [], sleepDurations = [], expenses = [], incomes = [];

  dates.forEach(date => {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const wake = localStorage.getItem(`${key}-wakeTime`);
    const sleep = localStorage.getItem(`${key}-sleepTime`);
    const expense = parseFloat(localStorage.getItem(`${key}-expense`) || 0);
    const income = parseFloat(localStorage.getItem(`${key}-income`) || 0);

    if (wake && sleep) {
      const [wakeH, wakeM] = wake.split(':').map(Number);
      const [sleepH, sleepM] = sleep.split(':').map(Number);
      const wakeMin = wakeH * 60 + wakeM;
      let sleepMin = sleepH * 60 + sleepM;
      if (sleepMin < wakeMin) sleepMin += 24 * 60;
      const duration = sleepMin - wakeMin;

      wakeTimes.push(wakeMin);
      sleepDurations.push(duration);
    }

    expenses.push(expense);
    incomes.push(income);
  });

  if (wakeTimes.length) {
    const avgWakeMin = Math.round(wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length);
    avgWake.textContent = `${String(Math.floor(avgWakeMin / 60)).padStart(2, '0')}:${String(avgWakeMin % 60).padStart(2, '0')}`;
  } else {
    avgWake.textContent = '-';
  }

  if (sleepDurations.length) {
    const avgSleepMin = Math.round(sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length);
    avgSleep.textContent = `${Math.floor(avgSleepMin / 60)}時間${avgSleepMin % 60}分`;
  } else {
    avgSleep.textContent = '-';
  }

  if (expenseMode === 'week') {
    const totalExp = expenses.reduce((a, b) => a + b, 0);
    const totalInc = incomes.reduce((a, b) => a + b, 0);
    const avgExp = Math.round(totalExp / dates.length);
    totalExpense.textContent = totalExp.toFixed(0);
    totalIncome.textContent = totalInc.toFixed(0);
    avgExpensePerDay.textContent = avgExp.toFixed(0);
  } else {
    const monthDates = getPeriodDates('month');
    const exp = monthDates.map(d => parseFloat(localStorage.getItem(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-expense`) || 0));
    const inc = monthDates.map(d => parseFloat(localStorage.getItem(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-income`) || 0));
    const totalExp = exp.reduce((a, b) => a + b, 0);
    const totalInc = inc.reduce((a, b) => a + b, 0);
    const avgExp = Math.round(totalExp / monthDates.length);
    totalExpense.textContent = totalExp.toFixed(0);
    totalIncome.textContent = totalInc.toFixed(0);
    avgExpensePerDay.textContent = avgExp.toFixed(0);
  }
}

updateButtons();
updateSummary();
