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

function UserInputProcessing(type, inputVal) {
  console.log(type);
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

    case type === "delete":
      if (lastUserInput.type === "operator") {
        userInputExpressionArr.pop();
        console.log(userInputExpressionArr);
        break;
      }

      if (lastUserInput.type === "number") {
        //negative number check
        let s = lastUserInput.strValue;
        if (lastUserInput.strValue.includes(")")) {
          console.log(50);
          let strNumValue = s.slice(2, s.length - 1);
          console.log("pre-strNumValue:", strNumValue);
          console.log("pre-strNumValue.l:", strNumValue.length);
          lastUserInput.strValue = `(-${strNumValue.slice(
            0,
            strNumValue.length - 1
          )})`;
          console.log("post-strNumValue:", strNumValue);
          console.log("post-strNumValue.l:", strNumValue.length);
          if (lastUserInput.strValue.length === 3) {
            userInputExpressionArr.pop();
            break;
          }
          break;
        }
        //positive number
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
        break;
      }

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
