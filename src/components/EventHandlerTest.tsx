/*
// expected output:

function log(msg: string) {
  console.log(msg);
}
const handleClick = () => log("hello world");
const e1 = document.querySelector('[data-ref="1"]');
e1.addEventListener("click", handleClick);

*/

function log(msg: string) {
  console.log(msg);
}

export function Counter() {
  const handleClick = () => log("hello world");

  return (
    <section>
      <button onClick={handleClick}>click me</button>
    </section>
  );
}
