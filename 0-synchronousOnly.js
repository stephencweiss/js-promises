class MyPromise {
  result;
  constructor(executorFn) {
    executorFn(this.resolve.bind(this));
  }
  resolve(arg) {
    this.result = arg;
  }
  then(cb) {
    return cb(this.result);
  }
}

function main() {
  console.log(`---------\nHandling synchronous code`);
  const myPromise = new MyPromise((onSettle) => {
    console.log("Executor running...");
    onSettle("test");
  });

  myPromise.then((result) => console.log(`the result is: ${result}`)); // the result is: test
  myPromise.then((result) =>
    console.log(`the result, once again, is: ${result}`)
  ); // the result, once again, is: test
}

module.exports = { main };
