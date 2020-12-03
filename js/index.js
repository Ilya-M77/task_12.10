// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightFruit = document.querySelector('.minweight__input');
const maxWeightFruit = document.querySelector('.maxweight__input');

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = "";
  for (let i = 0; i < fruits.length; i++) {
    const liFruit = document.createElement("li");
    if (fruits[i].color == "фиолетовый") {
      liFruit.className = 'fruit__item fruit_violet';
    } else if (fruits[i].color == "зеленый") {
      liFruit.className = 'fruit__item fruit_green';
    } else if (fruits[i].color == "розово-красный") {
      liFruit.className = 'fruit__item fruit_carmazin';
    } else if (fruits[i].color == "желтый") {
      liFruit.className = 'fruit__item fruit_yellow';
    } else if (fruits[i].color == "светло-коричневый") {
      liFruit.className = 'fruit__item fruit_lightbrown';
    };
    liFruit.innerHTML = `<div class="fruit__info">
                        <div>Код: ${i}</div>
                        <div>Вид: ${fruits[i].kind}</div>
                        <div>Цвет: ${fruits[i].color}</div>
                        <div>Вес (кг): ${fruits[i].weight}</div>
                      </div>`
    fruitsList.appendChild(liFruit);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  while (fruits.length > 0) {
    const i = getRandomInt(0, fruits.length - 1);
    result.push(fruits[i]);
    if (result == fruits) {
      alert('Порядок не изменился');
      return false;
    }
    fruits.splice(i, 1);
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    return (item.weight >= minWeightFruit.value && item.weight <= maxWeightFruit.value)
  });
};

filterButton.addEventListener('click', () => {
  if (isNaN(minWeightFruit.value) || isNaN(maxWeightFruit.value)) {
    alert('Введите числовое значение');
    return false;
  }
  else if ((minWeightFruit.value <= 0) || (maxWeightFruit.value <= 0)) {
    alert('Введите положительное число');
    return false;
  }
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = ['фиолетовый', 'зеленый', 'розово-красный', 'желтый', 'светло-коричневый']
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);
  return priority1 > priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    for (let i = 0, I = arr.length, k = I - 1; i < k; i++) {
      let indexMin = i;
      for (let j = i + 1; j < I; j++) {
        if (comparation(arr[indexMin], arr[j])) {
          indexMin = j;
        }
      }
      if (indexMin !== i) {
        [arr[i], arr[indexMin]] = [arr[indexMin], arr[i]]
      }
    }
    return arr;
  },

  quickSort(arr, comparation) {
    function swap(items, firstIndex, secondIndex) {
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }
    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
      while (i <= j) {
        while (items[i] < pivot) {
          i++;
        }
        while (items[j] > pivot) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
        }
      }
      return i;
    }
    function quickSort(items, left, right) {
      var index;
      if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;
        index = partition(items, left, right);
        if (left < index - 1) {
          quickSort(items, left, index - 1);
        }
        if (index < right) {
          quickSort(items, index, right);
        }
      }
      return items;
    }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKindLabel.textContent == 'bubbleSort' ? sortKindLabel.textContent = 'quickSort' : sortKindLabel.textContent = 'bubbleSort'
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.innerText = 'Сортировка....';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.innerText = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/
addActionButton.addEventListener('click', () => {
  if ((kindInput.value == '') || (weightInput.value == '')) {
    alert('Заполните все поля');
    return false;
  }
  else if (isNaN(weightInput.value)) {
    alert('Введите числовое значение в поле "Вес"');
    return false;
  }
  let newFruit = { kind: kindInput.value, color: colorInput.value, weight: weightInput.value };
  fruits.push(newFruit);
  display(fruits);
  display();
});
