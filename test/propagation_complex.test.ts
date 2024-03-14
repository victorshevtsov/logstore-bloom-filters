import { diffToAwait } from "../src/diffToAwait";
import { diffToPropagate } from "../src/diffToPropagate";
import { getHashMap } from "../src/getHashMap";
import data from "./data_20.json";

describe(`if PN has missing data in a set of ${data.length} elements (complex)`, () => {
  const testCases = [];

  for (let missing = 1; missing <= data.length; missing++) {
    for (let index = 0; index < data.length - missing; index++) {
      testCases.push({
        missing,
        index: index,
      })
    }
  }

  const FN = getHashMap(data);

  test.each(testCases)("FN propagates $missing missing element(s) at index $index`", ({ missing, index }) => {
    const testData = [...data];
    testData.splice(index, missing);

    const PN = getHashMap(testData);

    const awaiting = diffToAwait(FN.hash, PN.hashMap, FN.bloomFilter);
    const propagating = diffToPropagate(FN.hashMap, PN.bloomFilter);

    expect(awaiting).toBeTruthy();
    expect(propagating).toHaveLength(missing);
  });
});
