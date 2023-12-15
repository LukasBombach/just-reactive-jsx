# just-reactive-jsx

Next steps

- [ ] Clean up
  - [ ] Reactive declarations quick implementation hack
  - [ ] Reactive declarations selecting, possible edge-cases
  - [ ] transformJsxExpressionContainers finds and transforms in one
  - [ ] Really Remove React cleanly, even the package
- [x] Reactive Declarations
- [x] Rm React
- [ ] Hot Reload

evaluate

- [ ] EVALUATE: Compiler Augmented Reactivity (Signals)
- [ ] EVALUATE: Automatic Reactive Declarations & Reactive Statements

prove

- [ ] PROVE: Business Logic Outside of Components (& other state managers)
- [ ] PROVE: Just enough JavaScript (Hydration)
- [ ] PROVE: Non-Ownership of the DOM
- [ ] PROVE: Fine-Grained Page Loading Strategy (& Hydration Strategy)
- [ ] PROVE: Performance (Drag & Drop Performance Demo)

Notes:

- [x] Basic reactivity
- [ ] Get rid of unneded imports (React)
- [ ] Reactive Declarations
- [ ] Reactive Statements
- [ ] CSS (Tailwind)
- [ ] Drag & Drop Perormance Demo
- [ ] SSR & Hydration
- [ ] Hydration Strategy in Loading Strategy
- [ ] Inclusion of other CSS solutions than Tailwind
- [ ] Inclusion of other JS libraries from the eco system
- [ ] Inclusion of ther State Managers

## SSR & Hydration output

### Input

```tsx
function Counter() {
  const count = signal(0);

  return (
    <section>
      <input value={count} />
      <button onClick={() => count.set(count() + 1)}>count: {count}</button>
    </section>
  );
}
```

### SSR

```html
<section>
  <input value="0" r:0 />
  <button r:1>
    count:
    <!-- r:2 -->0<!-- r:2 -->
  </button>
</section>
```

```html
<section>
  <script type="text/h-0" /></script>
  <input value="0" />
  <script type="text/h-1" /></script>
  <button r:1>
    count:
    <script type="text/h-2" /></script>
    0
    <script type="text/h-2" /></script>
  </button>
</section>
```

### Client Js

```tsx
import { signal, attr, event, child } from "runtime";

const count = signal(0);

attr(0, "value", count);
event(1, "click", () => count.set(count() + 1));
child(2, 0, count);
```
