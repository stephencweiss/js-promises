class MyPromise {
  queue = [];
  constructor(executorFn) {
    executorFn(this.resolve.bind(this));
  }
  resolve(arg) {
    this.queue.forEach((cb) => cb(arg));
  }
  then(cb) {
    return this.queue.push(cb.bind(this));
  }
}

function asynchronous() {
  console.log(`---------\nAsynchronous`);
  const myFirstPromise = new MyPromise((onSettle) => {
    console.log("Executor running...");
    setTimeout(() => onSettle("asynchronous"), 1000);
  });
  myFirstPromise.then((result) => console.log(`the result is: ${result}`)); // the result is: asynchronous
  myFirstPromise.then((result) =>
    console.log(`the result, once again, is: ${result}`)
  ); // the result is: asynchronous
}

function synchronous() {
  console.log(`---------\nSynchronous`);
  const mySecondPromise = new MyPromise((onSettle) => {
    console.log("Executor running again...");
    onSettle("synchronous");
  });
  mySecondPromise.then((result) => console.log(`the result is: ${result}`)); // the result is: synchronous
  mySecondPromise.then((result) =>
    console.log(`the result, once again, is: ${result}`)
  ); // the result is: synchronous
}

function main() {
  console.log(`Step 2 - Demonstrates that Synchronous is now broken`);
  asynchronous();
  synchronous();
}

module.exports = { main };
