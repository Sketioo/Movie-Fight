const debounce = (func, delay) => {
  let timerID;
  return (...args) => {
    if(timerID) clearTimeout(timerID);
    timerID = setTimeout(() => {
      func.apply(null, args);
    }, 500)
  }
}