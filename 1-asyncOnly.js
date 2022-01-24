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

function main() {
  console.log(`Step 1`);
  console.log(`---------\nHandling asynchronous code`);
  const myPromise = new MyPromise((onSettle) => {
    console.log("Executor running...");
    setTimeout(() => onSettle("test"), 1000);
  });
  myPromise.then((result) => console.log(`the result is: ${result}`)); // the result is: test
  myPromise.then((result) =>
    console.log(`the result, once again, is: ${result}`)
  ); // the result is: test
  console.log(`after then calls`);
}

module.exports = { main };
