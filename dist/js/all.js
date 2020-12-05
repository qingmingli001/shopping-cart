
class Course {
  constructor(id, price, instructor, availableSpaces, title, description, image) {
    this.id = id;
    this.price = price;
    this.instructor = instructor;
    this.availableSpaces = availableSpaces;
    this.title = title;
    this.description = description;
    this.image = image;
  }
}

const cartEle = document.querySelector('.popover');
const coursesEle = document.querySelector('.courses');

cartEle.addEventListener('click', function() {
  document.querySelector('.cart-inner').classList.toggle('hide');
});


const courses = [
  new Course(
    "SD100",
    154.99,
    "Chris MacDonald",
    15, 
    "Introduction to Web Development",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "html_and_css.jpg"
  ),
  new Course(
    "SD110",
    223.01,
    "Chris MacDonald",
    3, 
    "JavaScript Basics",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "js-basics.png"
  ),
  new Course(
    "SD120",
    99.99,
    "Chris MacDonald",
    10, 
    "Object Oriented JavaScript",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "advanced-javascript.png"
  ),  
  new Course(
    "SD145",
    49.99,
    "Chris MacDonald",
    30, 
    "JavaScript Testing",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "testing.png"
  ),
  new Course(
    "SD260",
    149.99,
    "Chris MacDonald",
    5, 
    "Introduction to React",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "react.jpg"
  ),
  new Course(
    "SD130",
    149.99,
    "Chris MacDonald",
    15, 
    "Tools and Automation",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "tools.png"
  ),
];


courses.forEach(function(course) {
  coursesEle.insertAdjacentHTML('afterbegin', `
    <li data-course-id="${course.id}">
      <img src="images/${course.image}">
      <div class="info">
        <h3 id="item-title">${course.title}</h3>
        <p id="item-description">
          ${course.description}
        </p>
        <div id="price">
          <h4>Price:</h4> 
          <span>$${course.price}</span>
        </div>
        <div id="instructor">
          <h4>Instructor</h4>
          <span>${course.instructor}</span>
        </div>
        <button id="add-to-cart">Add To Cart</button>
        <div id="spaces-remaining"><span>${course.availableSpaces}</span> spaces remaining</div>
      </div>
    </li>`);
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2NvdXJzZXMuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBDb3Vyc2Uge1xuICBjb25zdHJ1Y3RvcihpZCwgcHJpY2UsIGluc3RydWN0b3IsIGF2YWlsYWJsZVNwYWNlcywgdGl0bGUsIGRlc2NyaXB0aW9uLCBpbWFnZSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnByaWNlID0gcHJpY2U7XG4gICAgdGhpcy5pbnN0cnVjdG9yID0gaW5zdHJ1Y3RvcjtcbiAgICB0aGlzLmF2YWlsYWJsZVNwYWNlcyA9IGF2YWlsYWJsZVNwYWNlcztcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcbiAgfVxufVxuXG5jb25zdCBjYXJ0RWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcG92ZXInKTtcbmNvbnN0IGNvdXJzZXNFbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291cnNlcycpO1xuXG5jYXJ0RWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0LWlubmVyJykuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZScpO1xufSk7XG5cblxuY29uc3QgY291cnNlcyA9IFtcbiAgbmV3IENvdXJzZShcbiAgICBcIlNEMTAwXCIsXG4gICAgMTU0Ljk5LFxuICAgIFwiQ2hyaXMgTWFjRG9uYWxkXCIsXG4gICAgMTUsIFxuICAgIFwiSW50cm9kdWN0aW9uIHRvIFdlYiBEZXZlbG9wbWVudFwiLFxuICAgIFwiTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY28gbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLlwiLFxuICAgIFwiaHRtbF9hbmRfY3NzLmpwZ1wiXG4gICksXG4gIG5ldyBDb3Vyc2UoXG4gICAgXCJTRDExMFwiLFxuICAgIDIyMy4wMSxcbiAgICBcIkNocmlzIE1hY0RvbmFsZFwiLFxuICAgIDMsIFxuICAgIFwiSmF2YVNjcmlwdCBCYXNpY3NcIixcbiAgICBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci5cIixcbiAgICBcImpzLWJhc2ljcy5wbmdcIlxuICApLFxuICBuZXcgQ291cnNlKFxuICAgIFwiU0QxMjBcIixcbiAgICA5OS45OSxcbiAgICBcIkNocmlzIE1hY0RvbmFsZFwiLFxuICAgIDEwLCBcbiAgICBcIk9iamVjdCBPcmllbnRlZCBKYXZhU2NyaXB0XCIsXG4gICAgXCJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuXCIsXG4gICAgXCJhZHZhbmNlZC1qYXZhc2NyaXB0LnBuZ1wiXG4gICksICBcbiAgbmV3IENvdXJzZShcbiAgICBcIlNEMTQ1XCIsXG4gICAgNDkuOTksXG4gICAgXCJDaHJpcyBNYWNEb25hbGRcIixcbiAgICAzMCwgXG4gICAgXCJKYXZhU2NyaXB0IFRlc3RpbmdcIixcbiAgICBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci5cIixcbiAgICBcInRlc3RpbmcucG5nXCJcbiAgKSxcbiAgbmV3IENvdXJzZShcbiAgICBcIlNEMjYwXCIsXG4gICAgMTQ5Ljk5LFxuICAgIFwiQ2hyaXMgTWFjRG9uYWxkXCIsXG4gICAgNSwgXG4gICAgXCJJbnRyb2R1Y3Rpb24gdG8gUmVhY3RcIixcbiAgICBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci5cIixcbiAgICBcInJlYWN0LmpwZ1wiXG4gICksXG4gIG5ldyBDb3Vyc2UoXG4gICAgXCJTRDEzMFwiLFxuICAgIDE0OS45OSxcbiAgICBcIkNocmlzIE1hY0RvbmFsZFwiLFxuICAgIDE1LCBcbiAgICBcIlRvb2xzIGFuZCBBdXRvbWF0aW9uXCIsXG4gICAgXCJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuXCIsXG4gICAgXCJ0b29scy5wbmdcIlxuICApLFxuXTtcblxuXG5jb3Vyc2VzLmZvckVhY2goZnVuY3Rpb24oY291cnNlKSB7XG4gIGNvdXJzZXNFbGUuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgYFxuICAgIDxsaSBkYXRhLWNvdXJzZS1pZD1cIiR7Y291cnNlLmlkfVwiPlxuICAgICAgPGltZyBzcmM9XCJpbWFnZXMvJHtjb3Vyc2UuaW1hZ2V9XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5mb1wiPlxuICAgICAgICA8aDMgaWQ9XCJpdGVtLXRpdGxlXCI+JHtjb3Vyc2UudGl0bGV9PC9oMz5cbiAgICAgICAgPHAgaWQ9XCJpdGVtLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgJHtjb3Vyc2UuZGVzY3JpcHRpb259XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBpZD1cInByaWNlXCI+XG4gICAgICAgICAgPGg0PlByaWNlOjwvaDQ+IFxuICAgICAgICAgIDxzcGFuPiQke2NvdXJzZS5wcmljZX08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiaW5zdHJ1Y3RvclwiPlxuICAgICAgICAgIDxoND5JbnN0cnVjdG9yPC9oND5cbiAgICAgICAgICA8c3Bhbj4ke2NvdXJzZS5pbnN0cnVjdG9yfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhZGQtdG8tY2FydFwiPkFkZCBUbyBDYXJ0PC9idXR0b24+XG4gICAgICAgIDxkaXYgaWQ9XCJzcGFjZXMtcmVtYWluaW5nXCI+PHNwYW4+JHtjb3Vyc2UuYXZhaWxhYmxlU3BhY2VzfTwvc3Bhbj4gc3BhY2VzIHJlbWFpbmluZzwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9saT5gKTtcbn0pO1xuIiwiY2xhc3MgQ2FydCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvdXJzZXMgPSBbXTtcclxuICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICB9XHJcblxyXG4gIGFkZENvdXJzZShjb3Vyc2VJZCkge1xyXG4gICAgY29uc3QgY291cnNlVG9BZGQgPSB0aGlzLmZpbmRCeUlkKGNvdXJzZXMsIGNvdXJzZUlkKTtcclxuICAgIHRoaXMuY291cnNlcy5wdXNoKGNvdXJzZVRvQWRkKTtcclxuICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICBVSS5yZW5kZXJDYXJ0KCk7XHJcbiAgfTtcclxuXHJcbiAgcmVtb3ZlQ291cnNlKGNvdXJzZSkge1xyXG4gICAgY29uc3QgY291cnNlVG9EZWxldGUgPSB0aGlzLmZpbmQodGhpcy5jb3Vyc2VzLCBjb3Vyc2UpO1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNvdXJzZXMuaW5kZXhPZihjb3Vyc2VUb0RlbGV0ZSk7XHJcbiAgICB0aGlzLmNvdXJzZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHRoaXMubGVuZ3RoLS07XHJcbiAgICBVSS5yZW5kZXJDYXJ0KCk7XHJcbiAgfTtcclxuXHJcbiAgc3VidG90YWwoKSB7XHJcbiAgICBsZXQgc3VidG90YWwgPSAwO1xyXG4gICAgdGhpcy5jb3Vyc2VzLmZvckVhY2goKHYpID0+IHtcclxuICAgICAgc3VidG90YWwgKz0gdi5wcmljZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHN1YnRvdGFsLnRvRml4ZWQoMik7XHJcbiAgfTtcclxuXHJcbiAgdG90YWwoKSB7XHJcbiAgICBjb25zdCBzdWJ0b3RhbCA9IHBhcnNlRmxvYXQodGhpcy5zdWJ0b3RhbCgpKTtcclxuICAgIGNvbnN0IHRheGVzID0gc3VidG90YWwgKiAwLjEzO1xyXG4gICAgcmV0dXJuIChzdWJ0b3RhbCArIHRheGVzKS50b0ZpeGVkKDIpO1xyXG4gIH07XHJcblxyXG4gIGZpbmQoY291cnNlcywgY291cnNlKSB7XHJcbiAgICByZXR1cm4gY291cnNlcy5maW5kKChjdXJyZW50Q291cnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiBjdXJyZW50Q291cnNlID09PSBjb3Vyc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRCeUlkKGNvdXJzZXMsIGNvdXJzZUlkKSB7XHJcbiAgICByZXR1cm4gY291cnNlcy5maW5kKChjdXJyZW50Q291cnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiBjdXJyZW50Q291cnNlLmlkID09PSBjb3Vyc2VJZDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY291cnNlRXhpc3RzKGNvdXJzZUlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kQnlJZCh0aGlzLmNvdXJzZXMsIGNvdXJzZUlkKSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgVUkge1xyXG4gIHN0YXRpYyByZW5kZXJDYXJ0KCkge1xyXG4gICAgY29uc3QgY2FydExpc3RFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhcnQgdWwnKTtcclxuICAgIGNhcnRMaXN0RWxlbWVudC5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICBjYXJ0LmNvdXJzZXMuZm9yRWFjaCgoY291cnNlKSA9PiB7XHJcbiAgICAgIGNhcnRMaXN0RWxlbWVudC5wcmVwZW5kKFVJLmdlbmVyYXRlQ291cnNlSHRtbChjb3Vyc2UpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIFVJLnVwZGF0ZVN1YnRvdGFsKCk7XHJcbiAgICBVSS51cGRhdGVUb3RhbCgpO1xyXG4gICAgVUkudXBkYXRlTGVuZ3RoKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2VuZXJhdGVDb3Vyc2VIdG1sKGNvdXJzZSkge1xyXG4gICAgY29uc3QgbGlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuXHJcbiAgICBsaUVsZW1lbnQuaW5uZXJIVE1MID1cclxuICAgICAgYDxsaT5cclxuICAgICAgICA8aW1nIHNyYz1cImltYWdlcy8ke2NvdXJzZS5pbWFnZX1cIj5cclxuICAgICAgICA8ZGl2IGlkPVwiY2FydC10aXRsZVwiPiR7Y291cnNlLnRpdGxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgaWQ9XCJjYXJ0LXByaWNlXCI+JCR7Y291cnNlLnByaWNlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgaWQ9XCJkZWxldGVcIj5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFyIGZhLXRpbWVzLWNpcmNsZVwiPjwvaT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9saT5gO1xyXG5cclxuICAgIGxpRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsZXRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuICAgICAgY2FydC5yZW1vdmVDb3Vyc2UoY291cnNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBsaUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYmluZEFkZFRvQ2FydENsaWNrRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBjb25zdCBhZGRUb0NhcnRCdXR0b25zRWxlbWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNhZGQtdG8tY2FydCcpKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICBpZiAoYWRkVG9DYXJ0QnV0dG9uc0VsZW1lbnRzLmluY2x1ZGVzKGJ1dHRvbkVsZW1lbnQpKSB7XHJcbiAgICAgICAgY29uc3QgY291cnNlSWQgPSBidXR0b25FbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY291cnNlLWlkJyk7XHJcblxyXG4gICAgICAgIGlmIChjYXJ0LmNvdXJzZUV4aXN0cyhjb3Vyc2VJZCkgJiYgIWNvbmZpcm0oJ1RoaXMgY291cnNlIGlzIGFscmVhZHkgaW4geW91ciBsaXN0LCBkbyB5b3Ugd2FudCB0byBhZGQgaXQgYW55d2F5cz8nKSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgY2FydC5hZGRDb3Vyc2UoY291cnNlSWQpO1xyXG4gICAgICAgIGJ1dHRvbkVsZW1lbnQudGV4dENvbnRlbnQgPSAnSXRlbSBhZGRlZCEnO1xyXG4gICAgICAgIGJ1dHRvbkVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyNDcsMjQ5LDEwNSknO1xyXG4gICAgICAgIGJ1dHRvbkVsZW1lbnQuc3R5bGUuY29sb3IgPSAnYmxhY2snO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgYnV0dG9uRWxlbWVudC50ZXh0Q29udGVudCA9ICdBZGQgVG8gQ2FydCc7XHJcbiAgICAgICAgICBidXR0b25FbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjNDU2OTkwJztcclxuICAgICAgICAgIGJ1dHRvbkVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB1cGRhdGVTdWJ0b3RhbCgpIHtcclxuICAgIGNvbnN0IHN1YnRvdGFsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJ0b3RhbC1hbW91bnQnKTtcclxuICAgIHN1YnRvdGFsRWxlbWVudC50ZXh0Q29udGVudCA9ICckJyArIGNhcnQuc3VidG90YWwoKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB1cGRhdGVUb3RhbCgpIHtcclxuICAgIGNvbnN0IHRvdGFsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b3RhbC1hbW91bnQnKTtcclxuICAgIHRvdGFsRWxlbWVudC50ZXh0Q29udGVudCA9ICckJyArIGNhcnQudG90YWwoKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB1cGRhdGVMZW5ndGgoKSB7XHJcbiAgICBjb25zdCBsZW5ndGhFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2l0ZW1zLWluLWNhcnQnKTtcclxuICAgIGxlbmd0aEVsZW1lbnQudGV4dENvbnRlbnQgPSBgWW91IGhhdmUgJHtjYXJ0Lmxlbmd0aH0gaXRlbXMgaW4geW91ciBjYXJ0LmA7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjYXJ0ID0gbmV3IENhcnQoKTtcclxuXHJcblVJLnJlbmRlckNhcnQoKTtcclxuVUkuYmluZEFkZFRvQ2FydENsaWNrRXZlbnRMaXN0ZW5lcnMoKTsiXX0=
