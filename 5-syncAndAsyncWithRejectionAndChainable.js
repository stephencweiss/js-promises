class MyPromise {
  result;
  state = "PENDING"; // or 'FULFILLED' | 'REJECTED'
  onFulfillQueue = [];
  onRejectQueue = [];
  constructor(executorFn) {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
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
      return this;
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

function fakeApiResponse() {
  const user = {
    name: "stephen",
    favoriteNumber: 7,
  };
  if (Math.random() > 0.05) {
    return {
      data: user,
      statusCode: 200,
    };
  } else {
    return {
      statusCode: 400,
      message: "Bad Request",
      error: "Bad Request",
    };
  }
}

const makeApiCall = () => {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      const apiResponse = fakeApiResponse();
      if (apiResponse.statusCode >= 400) {
        reject(apiResponse);
      } else {
        resolve(apiResponse);
      }
    });
  });
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
  makeApiCall()
    .then((user) => {
      console.log(`in the first .then()`);
      return user;
    })
    .then((user) => {
      console.log(`and the second one!`, { user });
    });
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
  console.log(`Step 5 - Handling sync and async with rejections`);
  asynchronous();
  // asynchronousFail();
  // synchronous();
}

module.exports = { main };
