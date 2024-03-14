import { ScalableBloomFilter } from "bloom-filters";

export function diffToPropagate(hashMap: Map<string, string>, bloomFilterJson: JSON) {
  const messageIds = [];

  const bloomFilter = ScalableBloomFilter.fromJSON(bloomFilterJson);

  for (const [messageId, messageHash] of hashMap) {
    if (!bloomFilter.has(messageHash)) {
      messageIds.push(messageId);
    }
  }

  return messageIds;
}
