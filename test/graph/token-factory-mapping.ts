// Import necessary components from The Graph protocol library
import { Address, dataSource } from "@graphprotocol/graph-ts";
import { TokenCreated } from "./generated/TokenFactory/TokenFactory";
import { TokenCreation } from "./generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { TokenTemplate } from "./generated/templates";

// Handle TokenCreated events emitted by the Token Factory
export function handleTokenCreated(event: TokenCreated): void {
  // Create and save a new TokenCreation entity to log the event
  let entity = new TokenCreation(event.params.tokenAddress.toHex());
  entity.tokenAddress = event.params.tokenAddress;
  entity.name = event.params.name;
  entity.symbol = event.params.symbol;
  entity.initialSupply = event.params.initialSupply;
  entity.owner = event.params.owner;
  entity.save();

  // Prepare a context to pass additional information to the Token template
  let context = new DataSourceContext();
  context.setString("tokenAddress", event.params.tokenAddress.toHex());

  // Instantiate the Token template with the given context
  TokenTemplate.createWithContext(event.params.tokenAddress, context);
}
