import { TypeormDatabase } from "@subsquid/typeorm-store";
import { processor } from "./processor";
import { Transaction } from "./model";
import * as erc20 from "./abi/ERC20";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  let transactions: Transaction[] = [];

  for (let block of ctx.blocks) {

    for (let transaction of block.transactions) {
        try {
          let { _to, _value} = erc20.functions.transfer.decode(transaction.input);
          transactions.push(
              new Transaction({
                  id: transaction.id,
                  amount: _value,
                  from: transaction.from || "0x",
                  recipient: _to,
                  token: transaction.to,
                  txid: transaction.hash,
                  createdAt: BigInt(block.header.timestamp.toString()),
              })
          );
        } catch (error) {
        }
    }
  }

  await ctx.store.insert(transactions);
});
