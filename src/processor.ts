import {lookupArchive} from '@subsquid/archive-registry'
// Import erc20 types generated from  the ABI
import * as erc20 from "./abi/ERC20";
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .setBlockRange({ from: 18553109 })
  .addLog({
    address: undefined,
    topic0: [
      erc20.events.Transfer.topic // topic0: 'Transfer(address,address,uint256)'
    ],
    transaction: true,
  })
  .setFields({
    transaction: {
        from: true,
        to: true,
        value: true,
        hash: true,
        input: true,
    },
    log: {
      topics: true,
      data: true
    }
  })

export type Fields = EvmBatchProcessorFields<typeof processor>

export type Block = BlockHeader<Fields>

export type Log = _Log<Fields>

export type Transaction = _Transaction<Fields>

export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>