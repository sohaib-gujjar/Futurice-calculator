import Queue from "../@base/queue";
import Stack from "../@base/stack";

export default class CalculatorService {

    public async calculate(expression: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                let result = undefined;

                let encodedExpression = expression.startsWith('[') ? expression.substring(1 , expression.length - 1) : expression;
                let buff = Buffer.from(encodedExpression, 'base64');
                let originalExpression = buff.toString('ascii');



                let output = this.shuntingYardAlgorithm(originalExpression);
                result = this.calculateRpn(output)

                let response = {
                    error: false,
                    result: result
                }

                resolve(response)
            } catch (error) {
                console.log(error)
                let responseError = {
                    error: true,
                    message: error.message
                }
                reject(responseError)
            }
        });
    }


    /**
     * Shunting yard algorithm - convert infix notation to reverse polish notation
     * @param {String} expression
     * @desc https://en.wikipedia.org/wiki/Shunting-yard_algorithm
     */
    shuntingYardAlgorithm(expression: any) {

        const operatorsSet = ["+", "-", "*", "/", "%", "^" ];
        const leftAssociationsSet = [ "*", "/", "^", "%", "+", "-" ];
        const rightAssociationsSet = [ "=", "!" ];
        const precedenceOfOperators: any = {
            "!": 4,

            "*": 3,
            "/": 3,
            "^": 3,
            "%": 3,

            "+": 2,
            "-": 2,

            "=": 1
        };


        let stack = new Stack<string>();
        let queue = new Queue<string>();

        for (let k = 0; k < expression.length; k++) {

            // current character in expression
            const ch = expression[k];

            // skip whitespace
            if (ch === " ") {
                continue;
            }

            // if the token is: - a number: put it into the output queue
            // if it's a digit then find whole number including decimals - e.g 258.55 is one number
            if (/\d/.test(ch)) {
                let m = k + 1;
                while (/\d/.test(expression[m]) || expression[m] === ".") {
                    m++;
                }
                let num = expression.substr(k, m - k)
                k = m - 1;
                queue.enqueue(num); // insert number to queue
            }

            else if (operatorsSet.includes(ch)) {

                // an operator o1
                const op1 = ch;

                // there is an operator o2 other than the left parenthesis at the top
                // of the operator stack, and (o2 has greater precedence than o1
                // or they have the same precedence and o1 is left-associative)
                while (stack.length() > 0) {

                    // another token at the top of the stack
                    const op2: string = stack.top();

                    if (operatorsSet.includes(op2) && (
                        
                        (leftAssociationsSet.includes(op1) && (precedenceOfOperators[op1] <= precedenceOfOperators[op2])) ||
                        
                        (rightAssociationsSet.includes(op1) && (precedenceOfOperators[op1] < precedenceOfOperators[op2]))
                    )) {

                        // pop o2 from the operator stack into the output queue
                        queue.enqueue(stack.pop());

                    } else {
                        break;
                    }

                }

                // push o1 onto the operator stack
                stack.push(op1);

            }
            // a left parenthesis
            else if (ch === "(") {

                // push it onto the operator stack
                stack.push(ch);
            }

            // a right parenthesis
            else if (ch === ")") {

                let foundLeftParen = false;

                // while the operator at the top of the operator stack is not a left parenthesis:
                while (stack.length() > 0) {
                    const c = stack.pop();
                    if (c === "(") {
                        foundLeftParen = true;

                        // pop the left parenthesis from the operator stack and discard it
                        break;
                    } else {

                        // pop the operator from the operator stack into the output queue
                        queue.enqueue(c);
                    }
                }

                // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
                if (!foundLeftParen) {
                    throw new Error("Parentheses mismatched");
                }

            }

            else {
                throw new Error(`Unknown token: ${ch}`);
            }

        }

        // while there are tokens on the operator stack
        while (stack.length() > 0) {

            // pop the operator from the operator stack onto the output queue
            const c = stack.pop();

            if (c === "(" || c === ")") {
                throw new Error("Parentheses mismatched");
            }

            queue.enqueue(c);

        }

        return queue;

    }

    /**
     * Reverse Polish notation - calculate actual result
     * @param {String[]} tokens
     * @desc find result using Reverse Polish notation from tokens
     */

    calculateRpn(tokens: Queue<string>) {

        var stack = [];

        while (tokens.length() > 0) {

            var a = tokens.dequeue(); // operator - last in first out

            // check if operator or not
            if (/[^+\-/*^%]/g.test(a)) {
                stack.push(a);
            } else {
                // more operators then number - at least two number required to perform operation
                if (stack.length < 2) {
                    throw new Error("Invalid expression");
                } else {
                    var c = Number(stack.pop());
                    var b = Number(stack.pop());
                    var d = 0;
                    // calculation w.r.t operator 
                    switch (a) {
                        case '+':
                            d = b + c;
                            break;

                        case '-':
                            d = b - c;
                            break;

                        case '*':
                            d = b * c;
                            break;

                        case '/':
                            d = b / c;
                            break;

                        case '^':
                            d = Math.pow(b, c);
                            break;
                        case '%':
                            d = b % c;
                            break;
                    }
                    stack.push(d); // result of last operation
                }
            }
        }

        // if result found then return result
        if (stack.length === 1) {
            return Number(stack.pop());
        }
        else throw new Error("Invalid expression");
    }
}