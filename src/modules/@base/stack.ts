export default class Stack<T> {

    private stack: Array<T>;

    constructor() {
        this.stack = [];
    }

    push(element: T) {
        this.stack.push(element);
    }

    pop() {
        if (this.stack.length == 0)
            throw new Error("Stack Is Empty");
        return this.stack.pop();
    }

    top() {
        if (this.stack.length == 0)
            throw new Error("Stack Is Empty");
        return this.stack[this.stack.length - 1];
    }

    isEmpty() {

        return this.stack.length == 0;
    }

    length() {
        return this.stack.length;
    }
}