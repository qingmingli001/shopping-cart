class Cart {
  constructor() {
    this.courses = [];
    this.length = 0;
  }

  addCourse(courseId) {
    const courseToAdd = this.findById(courses, courseId);
    this.courses.push(courseToAdd);
    this.length++;
    UI.renderCart();
  };

  removeCourse(course) {
    const courseToDelete = this.find(this.courses, course);
    const index = this.courses.indexOf(courseToDelete);
    this.courses.splice(index, 1);
    this.length--;
    UI.renderCart();
  };

  subtotal() {
    let subtotal = 0;
    this.courses.forEach((v) => {
      subtotal += v.price;
    });
    return subtotal.toFixed(2);
  };

  total() {
    const subtotal = parseFloat(this.subtotal());
    const taxes = subtotal * 0.13;
    return (subtotal + taxes).toFixed(2);
  };

  find(courses, course) {
    return courses.find((currentCourse) => {
      return currentCourse === course;
    });
  }

  findById(courses, courseId) {
    return courses.find((currentCourse) => {
      return currentCourse.id === courseId;
    });
  }

  courseExists(courseId) {
    return this.findById(this.courses, courseId) !== undefined;
  }
}

class UI {
  static renderCart() {
    const cartListElement = document.querySelector('#cart ul');
    cartListElement.innerHTML = '';

    cart.courses.forEach((course) => {
      cartListElement.prepend(UI.generateCourseHtml(course));
    });

    UI.updateSubtotal();
    UI.updateTotal();
    UI.updateLength();
  }

  static generateCourseHtml(course) {
    const liElement = document.createElement('li');

    liElement.innerHTML =
      `<li>
        <img src="images/${course.image}">
        <div id="cart-title">${course.title}</div>
        <div id="cart-price">$${course.price}</div>
        <div id="delete">
          <i class="far fa-times-circle"></i>
        </div>
      </li>`;

    liElement.querySelector('#delete').addEventListener('click', (event) => {
      cart.removeCourse(course);
    });

    return liElement;
  }

  static bindAddToCartClickEventListeners() {
    const addToCartButtonsElements = Array.from(document.querySelectorAll('#add-to-cart'));

    document.addEventListener('click', (event) => {
      const buttonElement = event.target;
      if (addToCartButtonsElements.includes(buttonElement)) {
        const courseId = buttonElement.parentElement.parentElement.getAttribute('data-course-id');

        if (cart.courseExists(courseId) && !confirm('This course is already in your list, do you want to add it anyways?')) { return; }

        cart.addCourse(courseId);
        buttonElement.textContent = 'Item added!';
        buttonElement.style.backgroundColor = 'rgb(247,249,105)';
        buttonElement.style.color = 'black';
        setTimeout(() => {
          buttonElement.textContent = 'Add To Cart';
          buttonElement.style.backgroundColor = '#456990';
          buttonElement.style.color = 'white';
        }, 2000);
      }
    });
  }

  static updateSubtotal() {
    const subtotalElement = document.querySelector('#subtotal-amount');
    subtotalElement.textContent = '$' + cart.subtotal();
  }

  static updateTotal() {
    const totalElement = document.querySelector('#total-amount');
    totalElement.textContent = '$' + cart.total();
  }

  static updateLength() {
    const lengthElement = document.querySelector('#items-in-cart');
    lengthElement.textContent = `You have ${cart.length} items in your cart.`;
  }
}

const cart = new Cart();

UI.renderCart();
UI.bindAddToCartClickEventListeners();