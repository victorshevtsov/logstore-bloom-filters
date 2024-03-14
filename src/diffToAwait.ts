import { ScalableBloomFilter } from "bloom-filters";
import { keccak256 } from "ethers/lib/utils";

export function diffToAwait(hash: string, hashMap: Map<string, string>, bloomFilterJson: JSON) {
  let localHash = keccak256([]);

  const bloomFilter = ScalableBloomFilter.fromJSON(bloomFilterJson);

  for (const [_messageId, messageHash] of hashMap) {
    if (bloomFilter.has(messageHash)) {
      localHash = keccak256(Uint8Array.from(Buffer.from(localHash + messageHash)));
    }
  }

  return hash !== localHash;
}
