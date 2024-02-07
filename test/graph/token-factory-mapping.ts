
import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { TokenCreated } from "./generated/TokenFactory/TokenFactory";
import { TokenCreation } from "./generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import {Token } from "./generated/templates";

export function handleTokenCreated(event: TokenCreated): void {
  log.info("Triggered handleTokenCreated", [])


  let entity = new TokenCreation(event.params.tokenAddress.toHex());
  entity.tokenAddress = event.params.tokenAddress;
  entity.name = event.params.name;
  entity.symbol = event.params.symbol;
  entity.initialSupply = event.params.initialSupply;
  entity.owner = event.params.owner;


  entity.save();
  Token.create(event.params.tokenAddress);


}
