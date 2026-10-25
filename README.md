# Calculator

A basic, responsive calculator that runs locally in a web browser.

## Project files

- `index.html` contains the calculator page and keypad.
- `styles.css` contains the responsive dark theme and layout.
- `script.js` contains the expression parser, calculations, and keyboard controls.
- `README.md` contains the project instructions and progress summary.

## Run the app

Open `index.html` in a modern web browser. No installation, build step, or internet connection is required.

## Features

- Addition, subtraction, multiplication, division, and modulo.
- Exponents, square roots, and squaring.
- Parentheses and decimal numbers.
- Change-sign control.
- Keyboard input for numbers and operators, plus Enter to calculate, Backspace to delete, and Escape or Delete to clear.
- Responsive dark interface with accessible button labels.
- Clear error messages for division by zero, invalid square roots, out-of-range results, and invalid factorial input.

## Supported expression syntax

The expression parser supports `+`, `-`, `*`, `/`, `%`, `^`, parentheses, and postfix factorial (`!`). Square root is available using the √ button. Exponents are right-associative, so `2^3^2` evaluates as `2^(3^2)`.

## Progress so far

- Created the calculator interface, styles, and expression evaluator in separate HTML, CSS, and JavaScript files.
- Verified in a browser that arithmetic precedence, parentheses, square roots, modulo, and division-by-zero handling work.
- Verified keyboard entry and backspace, as well as right-associative exponentiation, negative bases, and negative exponents.
