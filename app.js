let currentInput = '';

function updateDisplay() {
  const display = document.getElementById('result');
  display.value = currentInput === '' ? '0' : currentInput;
}

function appendNumber(num) {
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (currentInput === '') return;
  const lastChar = currentInput.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function deleteChar() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculateResult() {
  try {
    if (!currentInput) return;
    // Basic calculation sanitizer
    if (/^[0-9+\-*/. ]+$/.test(currentInput)) {
      currentInput = String(Function('"use strict";return (' + currentInput + ')')());
    } else {
      currentInput = 'Error';
    }
  } catch (e) {
    currentInput = 'Error';
  }
  updateDisplay();
}
