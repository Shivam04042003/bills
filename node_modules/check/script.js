document.getElementById('openCalculatorBtn').addEventListener('click', function() {
    document.getElementById('calculatorPopup').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('calculatorPopup').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('calculatorPopup')) {
        document.getElementById('calculatorPopup').style.display = 'none';
    }
}

let display = document.getElementById('display');
let currentOperand = '';
let previousOperand = '';
let operation = undefined;

function clearDisplay() {
    display.value = '';
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    currentOperand = currentOperand.toString() + number.toString();
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculateResult();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

function calculateResult() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function updateDisplay() {
    display.value = currentOperand;
}

document.addEventListener('keydown', function(event) {
    if (event.key >= 0 && event.key <= 9) {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber(event.key);
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        chooseOperation(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculateResult();
    } else if (event.key === 'Backspace') {
        clearDisplay();
    }
});
