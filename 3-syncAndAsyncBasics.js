class MyPromise {
  result;
  state = "PENDING"; // or 'FULFILLED'
  queue = [];
  constructor(executorFn) {
    executorFn(this.resolve.bind(this));
  }
  resolve(arg) {
    if (this.state === "PENDING") {
      this.state = "FULFILLED";
      this.result = arg;
      this.queue.forEach((cb) => cb(arg));
    }
  }
  then(cb) {
    if (this.state === "PENDING") {
      console.log(`calling then while still pending`);
      this.queue.push(cb);
    }
    if (this.state === "FULFILLED") {
      console.log(`calling then while fulfilled`);
      cb(this.result);
    }
  }
}

function asynchronous() {
  console.log(`---------\nAsynchronous`);

  const executorFn = (onSettle) => {
    console.log("Executor running...");
    setTimeout(() => onSettle("asynchronous"), 1000);
  };

  const myFirstPromise = new MyPromise(executorFn);
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
  console.log(`Step 3 - Basics handling sync and async`);
  asynchronous();
  synchronous();
}

module.exports = { main };
