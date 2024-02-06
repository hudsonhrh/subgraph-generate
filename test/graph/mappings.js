import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent, Approval as ApprovalEvent } from "../generated/Token/Token"
import { Transfer, Approval, TokenMinted, UserTokenBalance } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()

  // Handle initial mint
  if (event.params.from.toHexString() == "0x0000000000000000000000000000000000000000") {
    let mint = new TokenMinted(event.transaction.hash.toHex())
    mint.to = event.params.to
    mint.value = event.params.value
    mint.save()
  }

  // Update sender's balance (if not minting)
  if (event.params.from.toHex() != "0x0000000000000000000000000000000000000000") {
    let senderBalanceId = event.params.from.toHex()
    let senderBalance = UserTokenBalance.load(senderBalanceId)
    if (!senderBalance) {
      senderBalance = new UserTokenBalance(senderBalanceId)
      senderBalance.balance = BigInt.fromI32(0)
    }
    senderBalance.balance = senderBalance.balance.minus(event.params.value)
    senderBalance.save()
  }

  // Update recipient's balance
  let recipientBalanceId = event.params.to.toHex()
  let recipientBalance = UserTokenBalance.load(recipientBalanceId)
  if (!recipientBalance) {
    recipientBalance = new UserTokenBalance(recipientBalanceId)
    recipientBalance.balance = BigInt.fromI32(0)
  }
  recipientBalance.balance = recipientBalance.balance.plus(event.params.value)
  recipientBalance.save()
}
