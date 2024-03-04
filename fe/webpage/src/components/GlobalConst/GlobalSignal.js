// GlobalSignal.js
import { Signal } from "signals";

const globalSignal = {
  messageSignal: new Signal(),
  deviceSignal: new Signal()
};

export default globalSignal;
