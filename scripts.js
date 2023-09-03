let userInputExpressionArr = [];

function UserInputObj(type = undefined, strValue = undefined) {
  this.type = type;
  this.strValue = strValue;
  this.numValue = 0;
}

function calculatorDisplay() {
  let display = document.getElementById("expressionDisplay");
  display.textContent = userInputExpressionArr
    .map((item) => item.strValue)
    .join("");
}

function calculate() {
  let numValueArr = [];
  let decimalDigitsC = undefined;
  userInputExpressionArr.forEach((item) => {
    if (item.type === "operator") {
      numValueArr.push(item.strValue.trim());
      return;
    }
    if (item.type === "number") {
      if (item.strValue.includes("(")) {
        numValueArr.push(item.strValue.slice(2, item.strValue.length - 1) * -1);
      } else {
        // positive number
        numValueArr.push(+item.strValue);
      }
    }
  });

  for (let loop = 1; loop <= 2; loop++) {
    for (let index = 0; index < numValueArr.length; index++) {
      const element = numValueArr[index];
      let operationResult = undefined;

      if (element.toString().includes(".")) {
        let tempDigitsC = element.toString().split(".")[1].toString().length;
        if (decimalDigitsC === undefined || tempDigitsC > decimalDigitsC) {
          decimalDigitsC = tempDigitsC;
        }
      }
      if (Number.isFinite(+element) === false) {
        let leftOperand = numValueArr[index - 1];
        let rightOperand = numValueArr[index + 1];

        if (loop === 1 && (element === "÷" || element === "x")) {
          if (element === "÷") {
            operationResult = leftOperand / rightOperand;
            if (rightOperand === 0) {
              alert('Zero division error.')
              return "Math Error";
            }
          }
          if (element === "x") {
            operationResult = leftOperand * rightOperand;
          }
        }

        if (loop === 2 && (element === "+" || element === "-")) {
          if (element === "+") {
            operationResult = leftOperand + rightOperand;
          }
          if (element === "-") {
            operationResult = leftOperand - rightOperand;
          }
        }
        if (operationResult !== undefined) {
          numValueArr.splice(index - 1, 0, operationResult);
          numValueArr.splice(index, 3);
          index = index - 1;
        }
      }
    }
  }
  numValueArr[0] = +numValueArr[0].toFixed(decimalDigitsC + 1);
  return numValueArr;
}

function UserInputProcessing(type, inputVal) {
  let lastUserInput = userInputExpressionArr[userInputExpressionArr.length - 1];
  let usrInput = new UserInputObj(type);

  let numInput = (digitStr) => {
    usrInput.type = "number";
    usrInput.numValue = 0;
    usrInput.strValue = digitStr;
    return usrInput;
  };

  switch (true) {
    case userInputExpressionArr.length === 0:
      userInputExpressionArr.push(numInput("0"));
      calculatorDisplay();
      return;

    case type === "clear":
      userInputExpressionArr = [];
      userInputExpressionArr.push(numInput("0"));
      break;

    case userInputExpressionArr.some((element) => element.type === "equals"):
      if (type === "delete" || type === "clear") {
        UserInputProcessing("clear", null);
        return;
      }
      break;

    case type === "delete":
      if (lastUserInput.type === "operator") {
        userInputExpressionArr.pop();
        break;
      }

      if (lastUserInput.type === "number") {
        //negative number check
        let s = lastUserInput.strValue;
        if (lastUserInput.strValue.includes(")")) {
          let strNumValue = s.slice(2, s.length - 1);
          lastUserInput.strValue = `(-${strNumValue.slice(
            0,
            strNumValue.length - 1
          )})`;
          if (lastUserInput.strValue.length === 3) {
            userInputExpressionArr.pop();
            break;
          }
          break;
        }
        //positive number check
        else {
          if (s.slice(0, s.length - 1).length === 0) {
            userInputExpressionArr.pop();
            break;
          }
          lastUserInput.strValue = s.slice(0, s.length - 1);
          break;
        }
      }
      break;

    case type === "number":
      if (lastUserInput.type === "number") {
        if (
          userInputExpressionArr.length === 1 &&
          lastUserInput.strValue === "0"
        ) {
          lastUserInput.strValue = inputVal;
          break;
        }

        lastUserInput.strValue += inputVal;
        break;
      }

      userInputExpressionArr.push(numInput(inputVal));
      break;

    case type === "decimal":
      if (lastUserInput.strValue.includes(".")) {
        break;
      }
      if (lastUserInput.type === "operator") {
        userInputExpressionArr.push(numInput("0."));
        break;
      }
      lastUserInput.strValue += ".";
      break;

    case type === "changeSign":
      if (lastUserInput.numValue === -1) {
        lastUserInput.strValue = lastUserInput.strValue.slice(
          2,
          lastUserInput.strValue.length - 1
        );
        lastUserInput.numValue = 0;
        break;
      }
      if (lastUserInput.type === "number") {
        if (
          userInputExpressionArr.length > 0 &&
          lastUserInput.strValue === "0"
        ) {
          break;
        }
        lastUserInput.numValue = -1;
        lastUserInput.strValue = `(-${lastUserInput.strValue})`;
      }
      break;

    case type === "operator":
      if (lastUserInput.type === "number") {
        if (
          userInputExpressionArr.length === 1 &&
          lastUserInput.strValue == 0
        ) {
          break;
        }
        usrInput.strValue = ` ${inputVal} `;
        usrInput.numValue = null;
        userInputExpressionArr.push(usrInput);
      }
      break;

    case type === "equals":
      if (lastUserInput.type === "number") {
        usrInput.strValue = ` = ${calculate()}`;
        userInputExpressionArr.push(usrInput);
      }
      break;
  }

  if (userInputExpressionArr.length === 0) {
    UserInputProcessing(null, null);
  }
  if (userInputExpressionArr.length > 0 && lastUserInput.numValue < 0) {
    lastUserInput.strValue = lastUserInput.strValue.replace(")", "");
    lastUserInput.strValue += ")";
  }
  calculatorDisplay();
}

function calculatorScriptExecution() {
  let buttons = document.querySelector("#buttons");
  UserInputProcessing(null, null);

  buttons.addEventListener("click", (e) => {
    content = e.target.textContent;
    type = e.target.classList.item(1);
    UserInputProcessing(type, content);
  });
}

calculatorScriptExecution();
