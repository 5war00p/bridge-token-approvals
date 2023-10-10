import protobuf, { Message } from "protobufjs";

// Message structure with Protobuf
export const TokenApprovalWakuMessage = new protobuf.Type('TokenApproval')
    .add(new protobuf.Field('result', 1, 'string'))


export const serializeMessage = (protoMessage: Message) => {
    return TokenApprovalWakuMessage.encode(protoMessage).finish()
}