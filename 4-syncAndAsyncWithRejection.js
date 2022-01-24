class MyPromise {
  result;
  state = "PENDING"; // or 'FULFILLED' | 'REJECTED'
  onFulfillQueue = [];
  onRejectQueue = [];
  constructor(executorFn) {
    try {
      executorFn(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject.bind(this, error);
    }
  }

  resolve(arg) {
    if (this.state === "PENDING") {
      this.state = "FULFILLED";
      this.result = arg;
      this.onFulfillQueue.forEach((cb) => cb(arg));
    }
  }

  reject(arg) {
    if (this.state === "PENDING") {
      this.state = "REJECTED";
      this.result = arg;
      this.onRejectQueue.forEach((cb) => cb(arg));
    }
  }

  then(onFulfill, onReject) {
    if (this.state === "PENDING") {
      console.log(`calling then while still pending`);
      this.onFulfillQueue.push(onFulfill);
      onReject && this.onRejectQueue.push(onReject);
    }
    if (this.state === "FULFILLED") {
      console.log(`calling then while fulfilled`);
      onFulfill(this.result);
    }
    if (this.state === "REJECTED") {
      console.log(`calling then while rejected`);
      onReject(this.result);
    }
  }
}

const executorWrapper = (
  fail = false,
  timeToWait = 0,
  dataToReturn = '"Returned value"'
) => {
  return function executorFn(resolve, reject) {
    setTimeout(() => {
      try {
        if (fail) throw new Error("eek!");
        resolve(dataToReturn);
      } catch (e) {
        reject(e);
      }
    }, timeToWait);
  };
};

const onFulfill = (result, reject) => {
  try {
    console.log(`the result is: ${result}`);
    // console.log(`oh no, there was an error in the on onfulfill!`);
    // throw new Error(`Error in onFulfill`);
  } catch (e) {
    reject(e);
  }
};
const onReject = (reason) => console.log(`the rejected reason is: ${reason}`);

function asynchronous() {
  console.log(`---------\nAsynchronous`);
  const myFirstPromise = new MyPromise(executorWrapper());

  myFirstPromise.then(onFulfill); // the result is: "Returned value"
  myFirstPromise.then((result) =>
    console.log(`the result, once again, is: ${result}`)
  ); // the result, once again, is: "Returned value"
}

function asynchronousFail() {
  console.log(`---------\nAsynchronous Fail`);
  const myFirstPromise = new MyPromise(executorWrapper(true));

  myFirstPromise.then(onFulfill, onReject);
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
  console.log(`Step 4 - Handling sync and async with rejections`);
  asynchronous();
  asynchronousFail();
  synchronous();
}

module.exports = { main };
