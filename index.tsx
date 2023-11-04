import { signal, effect } from "@maverick-js/signals";
import enableJsDomGlobally from "jsdom-global";

enableJsDomGlobally();

const $text = signal("Hello World");

effect(() => console.log($text()));
