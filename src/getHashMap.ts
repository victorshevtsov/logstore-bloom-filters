import { StreamMessage, createSignaturePayload } from "@streamr/protocol";
import { ScalableBloomFilter } from "bloom-filters";
import { keccak256 } from "ethers/lib/utils";

export function getHashMap(data: any[]) {
  let hash = keccak256([]);
  const hashMap: Map<string, string> = new Map();
  const bloomFilter = new ScalableBloomFilter(undefined, undefined, undefined);

  for (const chunk of data) {
    const streamMessage = StreamMessage.deserialize(chunk);
    const payload = createSignaturePayload({
      messageId: streamMessage.getMessageID(),
      serializedContent: streamMessage.getSerializedContent(),
      prevMsgRef: streamMessage.prevMsgRef ?? undefined,
      newGroupKey: streamMessage.newGroupKey ?? undefined,
    });

    const messageId = streamMessage.getMessageID().serialize();
    const messageHash = keccak256(Uint8Array.from(Buffer.from(payload)));

    hash = keccak256(Uint8Array.from(Buffer.from(hash + messageHash)));
    hashMap.set(messageId, messageHash);
    bloomFilter.add(messageHash);
  }

  return { hash, hashMap, bloomFilter: bloomFilter.saveAsJSON() };
}
