'use strict';

// Получить кнопку "Рассчитать" через id
const start = document.getElementById('start');
start.disabled = true;
const cancel = document.getElementById('cancel');

// Получить кнопки“ + ”(плюс) через Tag, каждую в своей переменной.
const buttonPlusIncome = document.getElementsByTagName('button')[0];
const buttonPlusExpenses = document.getElementsByTagName('button')[1];

// получить чекбокс по id через querySelector
const checkboxForId = document.querySelector('#deposit-check');

// Получить поля для ввода возможных доходов(additional_income-item) при помощи querySelectorAll
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');

/* Получить все блоки в правой части программы 
через классы(которые имеют класс название - value, 
начиная с class="budget_day-value" и заканчивая class="target_month-value" > )*/
const budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];

/* Получить оставшиеся поля через querySelector 
каждый в отдельную переменную(Инпуты с левой стороны не забудьте про range)*/
const monthlyIncome = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const expensesTitle = document.querySelector('.expenses-title');
const expensesItems = document.querySelectorAll('.expenses-items');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');
const targetAmount = document.querySelector('.target-amount');
const incomeItem = document.querySelectorAll('.income-items');
const period = document.querySelector('.period');
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');
const depositBank = document.querySelector('.deposit-bank');


class AppData {
  constructor({
    income = {}, 
    addIncome = [],
    incomeMonth = 0,
    expenses = {},
    addExpenses = [],
    deposit = false,
    percentDeposit = 0,
    moneyDeposit = 0,
    budget = 0,
    budgetDay = 0,
    budgetMonth = 0,
    expensesMonth = 0
  } = {}) {
  this.income = {};
  this.addIncome = [];
  this.incomeMonth = 0;
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  }

  start () {

    this.budget = +monthlyIncome.value;
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getAddExpensesAddIncome();
    this.getInfoDeposit();
    this.getBudget();
    this.showChangePeriod();
    this.showChangeIncomePeriodValue();
    this.disabledInputText();
    this.changeButtonId();

    this.showResult();
  }
  showResult () {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = Math.ceil(this.getTargetMonth());
    incomePeriodValue.value = this.calcSavedMoney();
  }
  addBlock (cls, itms, btn) {
    let cloneItem = itms[0].cloneNode(true);
    cloneItem.children[0].value = '';
    cloneItem.children[1].value = '';
    itms[0].parentNode.insertBefore(cloneItem, btn);
    itms = document.querySelectorAll(cls);
    if (itms.length === 3) {
      btn.style.display = 'none';
    }
  }
  // онлайн изменение числа под бегунком изменения периода
  showChangePeriod () {
    periodAmount.textContent = periodSelect.value;
  }
  getExpenses () {
    // const _this = this;
    expensesItems.forEach(item => {
      const itemExpenses = item.querySelector('.expenses-title').value;
      const cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = cashExpenses;
      }
    });
  }
  getIncome () {
    // const _this = this;
    incomeItem.forEach(item => {
      const itemIncomeTitle = item.querySelector('.income-title').value;
      const incomeAmount = item.querySelector('.income-amount').value;

      if (itemIncomeTitle !== '' && incomeAmount !== '') {
        this.income[itemIncomeTitle] = incomeAmount;
      }
    });

    for (let key in this.income) {
      this.incomeMonth = +this.income[key];
    }
  }
  getAddExpensesAddIncome () {
    let addExpenses = additionalExpensesItem.value.split(',');

    addExpenses.forEach(item => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });

    additionalIncomeItem.forEach(item => {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }
  // Функция возвращает сумму всех расходов за месяц
  getExpensesMonth () {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
    return this.expensesMonth;
  }
  // Функция возвращает Накопления за месяц(Доходы минус расходы)
  getBudget () {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + (this.moneyDeposit * this.percentDeposit) / 12;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
    return this.budgetMonth;
  }
  /* Подсчитывает за какой период будет достигнута цель, зная результат месячного накопления и возвращает результат */
  getTargetMonth () {
    return targetAmount.value / this.budgetMonth;
  }
  getInfoDeposit () {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }
  calcSavedMoney () {
    return this.budgetMonth * periodSelect.value;
  }
  // онлайн замена значения "Накопления за период" при изменении периода
  showChangeIncomePeriodValue () {
    incomePeriodValue.value = this.budgetMonth * periodSelect.value;
  }
  // запрет на ввод информации в инпуты левого блока после нажатия на кнопку старт
  disabledInputText () {
    for (let i = 0; i < document.querySelectorAll('.data input[type=text]').length; i++) {
      if (monthlyIncome.value !== '') {
        document.querySelectorAll('.data input[type=text]')[i].setAttribute('disabled', '');
      }
    }
    depositBank.setAttribute('disabled', '');
  }
  // замена кнопки Расчитать на кнопку Сбросить
  changeButtonId () {
    const start = document.getElementById('start');
    const cancel = document.getElementById('cancel');
    if (monthlyIncome.value !== '') {
      start.style.display = 'none';
      cancel.style.display = 'block';
    }
  }
  reset () {
    this.income = {};
    this.addIncome = [];
    this.incomeMonth = 0;
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    depositBank.removeAttribute('disabled');

    document.querySelectorAll('.data input[type=text]').forEach(item => {
      item.removeAttribute('disabled');
    });

    document.querySelectorAll('input[type=text]').forEach(item => {
      item.value = '';
    });

    start.style.display = 'block';
    cancel.style.display = 'none';
    start.disabled = true;
    document.querySelector('#deposit-check').checked = false;
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    periodSelect.value = 1;
    periodAmount.textContent = periodSelect.value;
  }
  eventListiners () {
    const _this = this;
    start.addEventListener('click', function () {
      _this.start();
      _this.disabledInputText();
      _this.changeButtonId();
    });

    monthlyIncome.addEventListener('change', function () {
      if (monthlyIncome.value !== '') {
        start.disabled = false;
      } else {
        start.disabled = true;
      }
    });

    // buttonPlusExpenses.addEventListener('click', appData.addExpensesBlock);
    buttonPlusExpenses.addEventListener('click', () => {
      appData.addBlock('.expenses-items', expensesItems, buttonPlusExpenses);
    });
    // buttonPlusIncome.addEventListener('click', appData.addIncomeBlock);
    buttonPlusIncome.addEventListener('click', () => {
      appData.addBlock('.income-items', incomeItem, buttonPlusIncome);
    });

    periodSelect.addEventListener('change', function () {
      _this.showChangePeriod();
      _this.showChangeIncomePeriodValue();
    });

    cancel.addEventListener('click', function () {
      appData.reset();
    });

    checkboxForId.addEventListener('change', function () {
      if (checkboxForId.checked) {
        depositBank.style.display = 'inline-block';
        depositAmount.style.display = 'inline-block';
        appData.deposit = 'true';
        depositBank.addEventListener('change', function () {
          let selectIndex = this.options[this.selectedIndex].value;
          if (selectIndex === 'other') {
            depositPercent.style.display = 'inline-block';
            depositPercent.value = '';
          } else {
            depositPercent.style.display = 'none';
            depositPercent.value = selectIndex;
          }
        });
      } else {
        depositBank.style.display = 'none';
        depositAmount.style.display = 'none';
        depositAmount.value = '';
        appData.deposit = 'false';
      }
    });
  }
}

const appData = new AppData();

appData.eventListiners();