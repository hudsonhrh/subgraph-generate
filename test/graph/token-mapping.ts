import { BigInt, log } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent, Approval as ApprovalEvent } from "./generated/templates/TokenTemplate/Token"
import { Transfer, Approval } from "./generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'



export function handleTransfer(event: TransferEvent): void {
    log.info("Triggered handleTransfer", [])

  let entity = new Transfer(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
    log.info("Triggered handleApproval", [])
  let entity = new Approval(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}
