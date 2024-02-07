import { BigInt } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent, Approval as ApprovalEvent } from "./generated/templates/TokenTemplate/Token"
import { Transfer, Approval } from "./generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'

let context = dataSource.context()
let tokenAddress = context.getString('tokenAddress')

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}
