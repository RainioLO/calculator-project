
const button = document.querySelectorAll("button");
const result = document.getElementById("result");
let operator = "";

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", () => {
    const buttonValue = button[i].textContent;
    if (buttonValue === "C") {
      clearResult();
    } else if (buttonValue === "=") {
      calculateResult();
    } else if (buttonValue === "+") {
      operator = "add";
      appendValue(buttonValue);
    } else if (buttonValue === "-") {
      operator = "sub";
      appendValue(buttonValue);
    } else if (buttonValue === "*") {
      operator = "mul";
      appendValue(buttonValue);
    } else if (buttonValue === "/") {
      operator = "div";
      appendValue(buttonValue);
    } else {
      appendValue(buttonValue);
    }
  });
}

function clearResult() {
  result.value = "";
  operator = "";
}

function extractValues(inputValue) {
  // Regular expression to match numbers and the operator
  const regex = /^(\d+)\s*([-+*/])\s*(\d+)$/;

  // Use match to extract values
  const match = inputValue.match(regex);

  if (match) {
    const x = parseFloat(match[1]);
    const operator = match[2];
    const y = parseFloat(match[3]);

    if (!isNaN(x) && !isNaN(y) && operator) {
      return { x, operator, y };
    }
  }

  // Return null if extraction fails
  return null;
}

async function calculateResult() {
  try {
    const inputValue = result.value;
    if (inputValue === "") {
      throw new Error("Input value is empty");
    }
    const values = extractValues(inputValue);
    console.log("values " + values.x + " " + values.operator + " " + values.y);

    const response = await fetch(`http://localhost:8080/api/v1/?x=${values.x}&y=${values.y}&operation=${operator}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Adjust content type if needed
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    result.value = data.result;
  } catch (error) {
    console.error('Error calculating result:', error);
  }
}

function appendValue(buttonValue) {
  result.value = result.value + buttonValue;
}
