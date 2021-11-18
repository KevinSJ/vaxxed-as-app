/* eslint-disable global-require */
import { sha256 } from "js-sha256";
import elliptic from "elliptic";
import type { DecodedCOSEStructure } from "./coseTypes";
import { encodeCBOR } from "./cbor";

global.Buffer = global.Buffer || require("buffer").Buffer;

const EC = elliptic.ec;
const ec = new EC("p256");
interface RsaOtherPrimesInfo {
  d?: string;
  r?: string;
  t?: string;
}
interface JsonWebKey {
  alg?: string;
  crv?: string;
  d?: string;
  dp?: string;
  dq?: string;
  e?: string;
  ext?: boolean;
  k?: string;
  key_ops?: string[];
  kty?: string;
  n?: string;
  oth?: RsaOtherPrimesInfo[];
  p?: string;
  q?: string;
  qi?: string;
  use?: string;
  x?: string;
  y?: string;
}

export function validateCOSESignature(
  cosePayload: DecodedCOSEStructure,
  publicKeyJwt: JsonWebKey
): boolean {
  try {
    // protected is a typescript keyword
    const [protected_, , payload_, signature_] = cosePayload.value;

    // verified at a earlier point...
    if (!publicKeyJwt.x || !publicKeyJwt.y) {
      return false;
    }

    const xBuf = Buffer.from(publicKeyJwt.x, "base64");
    const yBuf = Buffer.from(publicKeyJwt.y, "base64");

    // 1) '04' + hex string of x + hex string of y
    const publicKeyHex = `04${xBuf.toString("hex")}${yBuf.toString("hex")}`;
    const key = ec.keyFromPublic(publicKeyHex, "hex");
    //   Sig_structure = [
    //     context : "Signature" / "Signature1" / "CounterSignature",
    //     body_protected : empty_or_serialized_map,
    //     ? sign_protected : empty_or_serialized_map,
    //     external_aad : bstr,
    //     payload : bstr
    // ]
    const bufferProtected = Buffer.from(protected_ as Buffer);
    const buffer0 = Buffer.alloc(0);
    const bufferPayload = Buffer.from(payload_ as Buffer);
    const SigStructure = [
      "Signature1",
      bufferProtected,
      buffer0,
      bufferPayload
    ];

    const ToBeSigned = encodeCBOR(SigStructure);
    const messageHash = sha256.digest(ToBeSigned);
    const signature = {
      r: signature_?.slice(0, signature_.length / 2),
      s: signature_?.slice(signature_.length / 2)
    };
    const result = key.verify(messageHash, signature);
    return result;
  } catch (err) {
    console.log(result);
    return null;
  }
}
