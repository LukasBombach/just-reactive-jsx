type Callback = (node: any) => void;

export function traverse(obj: any, callback: Callback) {
  // Call the callback for the current node
  callback(obj);

  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        traverse(obj[i], callback);
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          traverse(obj[key], callback);
        }
      }
    }
  }
}
