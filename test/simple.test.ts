import { diffToAwait } from "../src/diffToAwait";
import { diffToPropagate } from "../src/diffToPropagate";
import { getHashMap } from "../src/getHashMap";
import data from "./data_5000.json";

describe("Simple", () => {
  test("PN and FN have no records", () => {
    const PN = getHashMap([]);
    const FN = getHashMap([]);

    const awaiting = diffToAwait(FN.hash, PN.hashMap, FN.bloomFilter);
    const propagating = diffToPropagate(FN.hashMap, PN.bloomFilter);

    expect(awaiting).toBeFalsy();
    expect(propagating).toHaveLength(0);
  });

  test("PN and FN have the same records", () => {
    const PN = getHashMap(data);
    const FN = getHashMap(data);

    const awaiting = diffToAwait(FN.hash, PN.hashMap, FN.bloomFilter);
    const propagating = diffToPropagate(FN.hashMap, PN.bloomFilter);

    expect(awaiting).toBeFalsy();
    expect(propagating).toHaveLength(0);
  });

  test("PN has everything, FN has nothing", () => {
    const PN = getHashMap(data);
    const FN = getHashMap([]);

    const awaiting = diffToAwait(FN.hash, PN.hashMap, FN.bloomFilter);
    const propagating = diffToPropagate(FN.hashMap, PN.bloomFilter);

    expect(awaiting).toBeFalsy();
    expect(propagating).toHaveLength(0);
  });

  test("PN has nothing, FN has everything", () => {
    const PN = getHashMap([]);
    const FN = getHashMap(data);

    const awaiting = diffToAwait(FN.hash, PN.hashMap, FN.bloomFilter);
    const propagating = diffToPropagate(FN.hashMap, PN.bloomFilter);

    expect(awaiting).toBeTruthy();
    expect(propagating).toHaveLength(data.length);
  });
});
