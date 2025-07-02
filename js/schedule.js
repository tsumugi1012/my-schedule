'use strict';

const dateLabel = document.getElementById('dateLabel');
const scheduleContainer = document.getElementById('scheduleContainer');
const wakeTimeInput = document.getElementById('wakeTime');
const sleepTimeInput = document.getElementById('sleepTime');

let currentDate = new Date();
const params = new URLSearchParams(window.location.search);
if (params.get('date')) {
  currentDate = new Date(params.get('date'));
}

// 🔔 通知の許可リクエスト
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function updateDateDisplay() {
  dateLabel.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
}

function loadSchedule() {
  const dateStr = formatDate(currentDate);
  scheduleContainer.innerHTML = '';

  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const inputId = `${dateStr}-schedule-${timeStr}`;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = localStorage.getItem(inputId) || '';
      input.placeholder = '予定を入力';
      input.addEventListener('input', () => {
        localStorage.setItem(inputId, input.value);
      });

      const label = document.createElement('label');
      label.textContent = timeStr;

      // 🔔 通知ボタン
      const notifyBtn = document.createElement('button');
      notifyBtn.textContent = '🔔通知';
      notifyBtn.addEventListener('click', () => {
        if (Notification.permission !== 'granted') {
          alert('通知が許可されていません');
          return;
        }

        const now = new Date();
        const [nh, nm] = timeStr.split(':').map(Number);
        const notifTime = new Date(currentDate);
        notifTime.setHours(nh, nm, 0, 0);

        const delay = notifTime.getTime() - now.getTime();
        if (delay <= 0) {
          alert('過去の時間には通知できません');
          return;
        }

        setTimeout(() => {
          new Notification(`⏰ ${timeStr} の予定`, {
            body: input.value || '（予定なし）',
          });
        }, delay);

        alert(`✅ 通知を予約しました (${timeStr})`);
      });

      const div = document.createElement('div');
      div.className = 'time-slot';
      div.appendChild(label);
      div.appendChild(input);
      div.appendChild(notifyBtn);

      scheduleContainer.appendChild(div);
    }
  }

  // 起床・就寝時間の復元
  wakeTimeInput.value = localStorage.getItem(`${dateStr}-wakeTime`) || '';
  sleepTimeInput.value = localStorage.getItem(`${dateStr}-sleepTime`) || '';
}

// 起床・就寝時間の保存
wakeTimeInput.addEventListener('input', () => {
  const dateStr = formatDate(currentDate);
  localStorage.setItem(`${dateStr}-wakeTime`, wakeTimeInput.value);
});

sleepTimeInput.addEventListener('input', () => {
  const dateStr = formatDate(currentDate);
  localStorage.setItem(`${dateStr}-sleepTime`, sleepTimeInput.value);
});

// 日付切り替え
document.getElementById('prevDay').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDateDisplay();
  loadSchedule();
});

document.getElementById('nextDay').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateDisplay();
  loadSchedule();
});

// 初期表示
updateDateDisplay();
loadSchedule();
