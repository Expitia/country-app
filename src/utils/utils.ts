export const isValidJSON = (value: string) =>
  !!value &&
  typeof value === "string" &&
  /^[\],:{}\s]*$/.test(
    value
      .replace(/\\["\\\/bfnrtu]/g, "@")
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        "]"
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
  );

export const formatCurrency = (value: string | number) =>
  `${value}`.replace(/(.)(?=(\d{3})+$)/g, "$1.");

export const compareObjects = (
  obj1: Record<string, any>,
  obj2: Record<string, any>
) => obj1 && obj2 && JSON.stringify(obj1) === JSON.stringify(obj2);

export const getJSONStorage = (key: string) =>
  JSON.parse(localStorage.getItem(key));

export const setJSONStorage = (key: string, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    const anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
        aCallback(JSON.parse(anHttpRequest.responseText));
      }
    };

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);
  };
};
