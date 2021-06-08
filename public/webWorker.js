self.array = []
self.n = 0
self.queue = []
self.start = undefined;

self.addEventListener("message", async (event) => {
  if (isNaN(event.data)) {
    process(event.data)
  } else {
      self.queue.push([event.data, Date.now()]);
  }
});

async function Timeout(time) {
  return new Promise(resolve=>setTimeout(resolve, time));
}

// ~13500 ms for 100k if laptop conected to power 
// ~48000 ms for 100k if its not
async function process(data) {
    self.start = Date.now();
    self.array = data

    while (self.array.length > self.n) {
      if(self.n % 2000 == 0) await Timeout(0); // Timeout(0) ~ 4ms => 4ms * 25 ~ 100ms of delay for switching context

      if (self.queue.length == 0)
        insertionSortIteration()
      else {
        let newItem = self.queue.shift()
        self.array = [...self.array, newItem[0]]
        self.postMessage(`Item ${newItem[0]} added in ${Date.now() - newItem[1]}`);
      }
    }

    /* Proof of correct sort */
    console.log(self.array)
    self.postMessage(`Sort ended in ${Date.now() - self.start}`);
  ;
}

function insertionSortIteration() {
  let newPosition = binarySearch(self.array[self.n], 0, self.n)
  let value = self.array[self.n]

  if (self.n != newPosition) {
    self.array.splice(n, 1);
    self.array.splice(newPosition, 0, value);
  }
  self.n++;
}

function binarySearch(value, min, max) {
  if (min >= max) {
    return value > self.array[min] ? min + 1 : min;
  }
  let t = Math.floor((min + max) / 2);
  if (self.array[t] === value) {
    return t;
  } else if (self.array[t] < value) {
    return binarySearch(value, t + 1, max)
  } else {
    return binarySearch(value, min, t - 1)
  }
}