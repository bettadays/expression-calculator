const convertToArray = expr => {
  expr = expr.replace(/\s/g, '').split(''); // whitespace
  let bracketsCounter = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === "(") bracketsCounter++;
    if (expr[i] === ")") bracketsCounter--;
    if (/\d/.test(expr[i]) && /\d/.test(expr[i + 1])) { // not letter d, so escaped
      expr[i] = Number(expr[i] + expr[i + 1]);
      expr.splice([i + 1], 1);
      i-- // to ensure that number of any length will be concatenated
    }
    if (/\d/.test(expr[i])) expr[i] = Number(expr[i]);
  }
  if (bracketsCounter !== 0) throw new Error('ExpressionError: Brackets must be paired"');
  return expr;
}

const reformatArr = (expr, i) => { //each () are array
  for (; i < expr.length; i++) {
    if (expr[i] === "(") {
      let nextOpeningBracketIndex = expr.indexOf('(', i + 1);
      let nextClosingBracketIndex = expr.indexOf(')', i + 1);
      let delta = nextClosingBracketIndex - i;
      if (nextOpeningBracketIndex !== -1 && nextClosingBracketIndex < nextOpeningBracketIndex) {
        expr[i] = expr.splice(i + 1, delta - 1);
        expr.splice(i + 1, 1);
      } else if (nextOpeningBracketIndex !== -1 && nextClosingBracketIndex > nextOpeningBracketIndex) {
        reformatArr(expr, nextOpeningBracketIndex);
        i = -1; //not zero???
      } else {
        expr[i] = expr.splice(i + 1, delta - 1);
        expr.splice(i + 1, 1);
      }
    }
  }
  return expr;
}


const calcArr = expr => {
  let mathOperators = ['/', '*', '+', '-'];
  let  digits = [];
  let operators = [];
  for (let i = 0; i < expr.length; i++) {
    if (Array.isArray(expr[i])) {
      expr[i] = Number(calcArr(expr[i]));
    };
  }
  for (let i = 0; i < expr.length; i++) {
    if (expr.includes('/') && expr[i] === '/') {
      if (expr[i + 1] === 0) throw new TypeError(' TypeError: Division by zero.');
      expr[i - 1] /= expr[i + 1];
      expr.splice(i, 2);
      i = 0;
    }
  }
  for (let i = 0; i < expr.length; i++) {
    if (expr.includes('*') && expr[i] === '*') {
      expr[i - 1] *= expr[i + 1];
      expr.splice(i, 2);
      i = 0;
    }
  }
  for (let i = 0; i < expr.length; i++) {
    if (expr.includes('-') && expr[i] === '-') {
      expr[i - 1] -= expr[i + 1];
      expr.splice(i, 2);
      i = 0;
    }
  }
  for (let i = 0; i < expr.length; i++) {
    if (expr.includes('+') && expr[i] === '+') {
      expr[i - 1] += expr[i + 1];
      expr.splice(i, 2);
      i = 0;
    }
  }
  return expr;
}
function expressionCalculator(expr) {
  return Number(calcArr(reformatArr(convertToArray(expr), 0)));
}

module.exports = {
  expressionCalculator
}



//with stacks, but not for the whole expression but for each one in brakets
// const convertToArray = expr => {
//   expr = expr.replace(/\s/g, '').split(''); // whitespace
//   let bracketsCounter = 0;
//   for (let i = 0; i < expr.length; i++) {
//     if (expr[i] === "(") bracketsCounter++;
//     if (expr[i] === ")") bracketsCounter--;
//     if (/\d/.test(expr[i]) && /\d/.test(expr[i + 1])) { // not letter d, so escaped
//       expr[i] = Number(expr[i] + expr[i + 1]);
//       expr.splice([i + 1], 1);
//       i-- // to ensure that number of any length will be concatenated
//     }
//     if (/\d/.test(expr[i])) expr[i] = Number(expr[i]);
//   }
//   if (bracketsCounter !== 0) throw new Error('ExpressionError: Brackets must be paired"');
//   return expr;
// }

// const reformatArr = (expr, i) => { //each () are array
//   for (; i < expr.length; i++) {
//     if (expr[i] === "(") {
//       let nextOpeningBracketIndex = expr.indexOf('(', i + 1);
//       let nextClosingBracketIndex = expr.indexOf(')', i + 1);
//       let delta = nextClosingBracketIndex - i;
//       if (nextOpeningBracketIndex !== -1 && nextClosingBracketIndex < nextOpeningBracketIndex) {
//         expr[i] = expr.splice(i + 1, delta - 1);
//         expr.splice(i + 1, 1);
//       } else if (nextOpeningBracketIndex !== -1 && nextClosingBracketIndex > nextOpeningBracketIndex) {
//         reformatArr(expr, nextOpeningBracketIndex);
//         i = -1; //not zero???
//       } else {
//         expr[i] = expr.splice(i + 1, delta - 1);
//         expr.splice(i + 1, 1);
//       }
//     }
//   }
//   return expr;
// }

// const calc = (operand1, sign, operand2) => {
//   switch (sign) {
//     case '/':
//       if (operand2 === 0) throw new TypeError(' TypeError: Division by zero.');
//       return operand1 / operand2;
//     case '*':
//       return operand1 * operand2;
//     case '-':
//       return operand1 - operand2;
//     case '+':
//       return operand1 + operand2;
//   }
// }

// const calcArr = expr => {
//   const PRIORITY = {
//     '+': 1,
//     '-': 1,
//     '*': 2,
//     '/': 2
//   };
//   let digits = [];
//   let operators = [];
//   const getStackItem = (arr, i) => {
//     let item = arr.length - i;
//     return arr[item];
//   }

//   for (let i = 0; i < expr.length; i++) {
//     if (Array.isArray(expr[i])) {
//       expr[i] = Number(calcArr(expr[i]));
//     };
//     if (/\d/.test(expr[i])) {
//       digits.push(expr[i]);
//     } else {
//       let lastSign = getStackItem(operators, 1);
//       if (!PRIORITY[lastSign] || (PRIORITY[lastSign] < PRIORITY[expr[i]])) {
//         operators.push(expr[i]);
//       } else {
//         let lastDigit = getStackItem(digits, 1);
//         let beforeLastDigit = getStackItem(digits, 2);
//         let sign = getStackItem(operators, 1)
//         let result = calc(beforeLastDigit, sign, lastDigit);
//         digits.splice(-2); ///remove 2 last items
//         digits.push(result);
//         operators.pop();
//         i--;
//       }
//     }
//   }
//   for (let i = operators.length - 1; i > -1; i--) { // already checks length
//     if (PRIORITY[operators[i]] > (PRIORITY[operators[i - 1]] || -1)) {
//       let result = calc(digits[i], operators[i], digits[i + 1]);
//       digits.splice(i, 2, result); ///remove 2 last items
//       operators.splice(i, 1);
//     }
//   }
//   return digits;
// }


// function expressionCalculator(expr) {
//   return Number(calcArr(reformatArr(convertToArray(expr), 0)));
// }


