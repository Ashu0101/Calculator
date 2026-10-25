    const expressionDisplay = document.querySelector("#expression");
    const resultDisplay = document.querySelector("#result");
    let expression = "";
    let justEvaluated = false;

    function tokenize(input) {
      const tokens = [];
      let index = 0;

      while (index < input.length) {
        if (/\s/.test(input[index])) {
          index += 1;
          continue;
        }

        const number = input.slice(index).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
        if (number) {
          tokens.push({ type: "number", value: Number(number[0]) });
          index += number[0].length;
          continue;
        }

        if (input.slice(index).startsWith("sqrt")) {
          tokens.push({ type: "sqrt", value: "sqrt" });
          index += 4;
          continue;
        }

        const character = input[index];
        if ("+-*/%^()!".includes(character)) {
          tokens.push({ type: character, value: character });
          index += 1;
          continue;
        }

        throw new Error("Invalid expression");
      }

      return tokens;
    }

    function calculate(input) {
      const tokens = tokenize(input);
      let position = 0;
      const peek = () => tokens[position]?.type;
      const take = (type) => {
        if (peek() !== type) throw new Error("Invalid expression");
        return tokens[position++].value;
      };

      function primary() {
        if (peek() === "number") return take("number");
        if (peek() === "sqrt") {
          take("sqrt");
          take("(");
          const value = additive();
          take(")");
          if (value < 0) throw new Error("Square root needs a non-negative number");
          return Math.sqrt(value);
        }
        if (peek() === "(") {
          take("(");
          const value = additive();
          take(")");
          return value;
        }
        throw new Error("Invalid expression");
      }

      function postfix() {
        let value = primary();
        while (peek() === "!") {
          take("!");
          if (!Number.isInteger(value) || value < 0 || value > 170) {
            throw new Error("Factorial requires a whole number from 0 to 170");
          }
          let factorial = 1;
          for (let number = 2; number <= value; number += 1) factorial *= number;
          value = factorial;
        }
        return value;
      }

      function power() {
        const base = postfix();
        if (peek() === "^") {
          take("^");
          return base ** unary();
        }
        return base;
      }

      function unary() {
        if (peek() === "+") {
          take("+");
          return unary();
        }
        if (peek() === "-") {
          take("-");
          return -unary();
        }
        return power();
      }

      function multiplicative() {
        let value = unary();
        while (["*", "/", "%"].includes(peek())) {
          const operator = tokens[position++].type;
          const right = unary();
          if ((operator === "/" || operator === "%") && right === 0) {
            throw new Error("Cannot divide by zero");
          }
          if (operator === "*") value *= right;
          if (operator === "/") value /= right;
          if (operator === "%") value %= right;
        }
        return value;
      }

      function additive() {
        let value = multiplicative();
        while (peek() === "+" || peek() === "-") {
          const operator = tokens[position++].type;
          const right = multiplicative();
          value = operator === "+" ? value + right : value - right;
        }
        return value;
      }

      if (tokens.length === 0) throw new Error("Enter an expression");
      const value = additive();
      if (position !== tokens.length) throw new Error("Invalid expression");
      if (!Number.isFinite(value)) throw new Error("Result is out of range");
      return Object.is(value, -0) ? 0 : value;
    }

    function format(value) {
      return Number(value.toPrecision(12)).toString();
    }

    function render() {
      expressionDisplay.textContent = expression
        .replaceAll("*", "×")
        .replaceAll("/", "÷")
        .replaceAll("-", "−");
      resultDisplay.classList.remove("error");

      if (!expression) {
        resultDisplay.textContent = "0";
        return;
      }

      try {
        resultDisplay.textContent = format(calculate(expression));
      } catch (error) {
        if (error.message !== "Invalid expression" && error.message !== "Enter an expression") {
          resultDisplay.textContent = error.message;
          resultDisplay.classList.add("error");
        } else {
          resultDisplay.textContent = "…";
        }
      }
    }

    function append(value) {
      if (justEvaluated && /[\d.(]/.test(value)) expression = "";
      justEvaluated = false;
      expression += value;
      render();
    }

    function applyUnary(operation) {
      if (!expression) return;
      expression = operation + "(" + expression + ")";
      justEvaluated = false;
      render();
    }

    function evaluate() {
      try {
        const value = calculate(expression);
        expressionDisplay.textContent = expression
          .replaceAll("*", "×")
          .replaceAll("/", "÷")
          .replaceAll("-", "−") + " =";
        expression = format(value);
        resultDisplay.textContent = expression;
        resultDisplay.classList.remove("error");
        justEvaluated = true;
      } catch (error) {
        resultDisplay.textContent = error.message;
        resultDisplay.classList.add("error");
      }
    }

    function backspace() {
      expression = expression.slice(0, -1);
      justEvaluated = false;
      render();
    }

    document.querySelector(".keys").addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      const { action, value } = button.dataset;
      if (action === "clear") {
        expression = "";
        justEvaluated = false;
        render();
      } else if (action === "equals") {
        evaluate();
      } else if (action === "sqrt") {
        applyUnary("sqrt");
      } else if (action === "square") {
        if (expression) {
          expression = "(" + expression + ")^2";
          justEvaluated = false;
          render();
        }
      } else if (action === "sign") {
        if (expression) {
          expression = "-(" + expression + ")";
          justEvaluated = false;
          render();
        }
      } else if (value !== undefined) {
        append(value);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (/^[\d.+\-*/%^()!]$/.test(event.key)) {
        event.preventDefault();
        append(event.key);
      } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        evaluate();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
      } else if (event.key === "Escape" || event.key === "Delete") {
        expression = "";
        justEvaluated = false;
        render();
      }
    });

