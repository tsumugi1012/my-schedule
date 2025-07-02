'use strict';

const wishList = document.getElementById('wish-list');
const addBtn = document.getElementById('add-item-btn');

function saveWishState() {
  const items = [];
  document.querySelectorAll('#wish-list li').forEach(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const input = li.querySelector('input[type="text"]');
    items.push({
      checked: checkbox.checked,
      text: input.value
    });
  });
  localStorage.setItem('wishList', JSON.stringify(items));
}

function loadWishState() {
  const saved = localStorage.getItem('wishList');
  if (!saved) return;
  const items = JSON.parse(saved);
  items.forEach(item => createWishItem(item.checked, item.text));
}

function createDeleteButton(li) {
  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.style.fontSize = '20px';
  delBtn.style.border = 'none';
  delBtn.style.backgroundColor = 'transparent';
  delBtn.style.cursor = 'pointer';
  delBtn.style.color = '#e06666';

  delBtn.addEventListener('click', () => {
    li.remove();
    saveWishState();
  });

  return delBtn;
}

function createWishItem(checked = false, text = '') {
  const li = document.createElement('li');

  const dragHandle = document.createElement('span');
  dragHandle.textContent = '≡';
  dragHandle.className = 'drag-handle';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.addEventListener('change', saveWishState);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dotted-input';
  input.value = text;
  input.addEventListener('input', saveWishState);

  const delBtn = createDeleteButton(li);

  li.appendChild(dragHandle);
  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(delBtn);

  dragHandle.addEventListener('dragstart', (e) => {
    draggedItem = li;
    li.classList.add('dragging');
  });

  dragHandle.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    draggedItem = null;
    saveWishState();
  });

  dragHandle.draggable = true;

  wishList.appendChild(li);
}

window.addEventListener('DOMContentLoaded', () => {
  loadWishState();
  if (wishList.children.length === 0) {
    createWishItem();
  }
});

addBtn.addEventListener('click', () => {
  createWishItem();
  saveWishState();
});

let draggedItem = null;

wishList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(wishList, e.clientY);
  if (afterElement == null) {
    wishList.appendChild(draggedItem);
  } else {
    wishList.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
