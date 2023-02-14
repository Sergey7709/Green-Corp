const COLORS = ['255,108,80', '5,117,18', '29,39,57', '67,189,81'];
const BUBBLE_DENSITY = 100;
//! массив с данными (цвета) для  инициализации цвета пузырька одним из случайных цветов.Нужен для метода init() класса Bubble

function generateDecimalBetween(left, right) {
  return (Math.random() * (left - right) + right).toFixed(2);
} //! начальная позиция пузырька, его размер, скорость движения вверх, прозрачность цвета. Нужен для метода init() класса Bubble.

class Bubble {
  //!класс пузырьков
  constructor(canvas) {
    this.canvas = canvas;

    this.getCanvasSize();

    this.init();
  }

  getCanvasSize() {
    //! Вытаскивает из холста(Canvas) его размеры и сохраняет в переменные внутри класса Bubble.
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
  }

  init() {
    //!метод будет инициализировать пузырек: выбирать ему один из случайных цветов, какой-то размер,
    //! начальное положение на холсте.
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]; //! цвета пузырьков
    this.alpha = generateDecimalBetween(5, 10) / 10; //! Прозрачность пузырьков
    this.size = generateDecimalBetween(1, 3); //! Размер пузырьков
    this.translateX = generateDecimalBetween(0, this.canvasWidth); //! Начальная позиция Х координаты пузырьков
    this.translateY = generateDecimalBetween(0, this.canvasHeight); //! Начальная позиция Y координаты пузырьков
    this.velocity = generateDecimalBetween(20, 40); //! Начальная скорость пузырьков
    this.movementX = generateDecimalBetween(-2, 2) / this.velocity; //! движение(смещение) по горизонтали X со смещением пузырьков
    this.movementY = generateDecimalBetween(1, 20) / this.velocity; //! движение(смещение) по вертикали Y со смещением пузырьков
  }

  move() {
    //! метод будет пересчитывать положение пузырька на холсте, так как фигуры должны двигаться вверх.
    this.translateX = this.translateX - this.movementX;
    //! обновляет X координаты пузырька на значения movementX.
    //!X-координаты хранятся в свойствах translateX.
    this.translateY = this.translateY - this.movementY;
    //! обновляет Y координаты пузырька на значения movementY.
    //!X-координаты хранятся в свойствах translateY.

    if (
      //!проверяем, что значения опустились ниже 0 в координатах или вышли за горизонтальные границы,
      //! и, если это так, заново инициализируем данные.
      this.translateY < 0 ||
      this.translateX < 0 ||
      this.translateX > this.canvasWidth
    ) {
      this.init();
      this.translateY = this.canvasHeight;
    }
  }
}

class CanvasBackground {
  //! класс будет работать непосредственно с холстом(canvas): добавлять пузырьки, рисовать их, анимировать.
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio;
  }

  start() {
    //! Метод start запустит анимацию: подстроит размеры холста, создаст пузырьки и анимирует их.
    this.canvasSize(); //!  выставляем ширину и высоту холста и настроить масштаб
    this.generateBubbles(); //! Генерируем пузырьки
    this.animate(); //! запускаем анимацию
  }

  canvasSize() {
    this.canvas.width = this.canvas.offsetWidth * this.dpr; //! выставляем ширину для холста
    this.canvas.height = this.canvas.offsetHeight * this.dpr; //! выставляем высоту для холста
    this.ctx.scale(this.dpr, this.dpr); //! настроим масштаб.
  }

  animate() {
    //!для анимации пузырьков

    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight); //! очистка холста

    this.bubblesList.forEach((bubble) => {
      //! Вычисление новой позиции пузырька
      bubble.move(); //! Изменяет положение пузырьков
      this.ctx.translate(bubble.translateX, bubble.translateY);
      //! Изменяет положение пузырьков на значение (bubble.translateX, bubble.translateY).
      this.ctx.beginPath(); //! отрисовка нового пути пузырька
      this.ctx.arc(0, 0, bubble.size, 0, 2 * Math.PI); //! рисует круг с центром 0,0 и радиусом bubble.size.
      this.ctx.fillStyle = 'rgba(' + bubble.color + ',' + bubble.alpha + ')'; //! закрашивет круг нужным цветом
      this.ctx.fill(); //! Закраска пузырька
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      //! настройка масштабирования, размер пузырька отрисовывается согласно размерам холста
    });

    requestAnimationFrame(this.animate.bind(this)); //! метод для запуска анимации  пузырьков
  }

  generateBubbles() {
    //! Функция для генерирации пузырьков
    this.bubblesList = [];
    for (let i = 0; i < BUBBLE_DENSITY; i++) {
      this.bubblesList.push(new Bubble(this.canvas));
    }
  }
}

const canvas = new CanvasBackground('orb-canvas');
//! Cоздаем экземпляр класса CanvasBackground, указав ему правильный id в качестве аргумента конструктора
canvas.start(); //! Запуск анимации
