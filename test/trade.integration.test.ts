import { IdentityOpts, fetchAndUnblindUtxos, MnemonicOpts } from 'ldk';
import { Trade, IdentityType, greedyCoinSelector } from '../src/index';
import { TDEXMnemonic } from '../src/tdexMnemonic';

import tradeFixture from './fixtures/trade.integration.json';

//import { sleep } from './_regtest';

const market = tradeFixture.market;

const identityOpts: IdentityOpts<MnemonicOpts> = {
  chain: 'regtest',
  type: IdentityType.Mnemonic,
  opts: {
    mnemonic:
      'outer prosper fish exclude pitch jaguar hole water head cream glimpse drive',
  },
};

const explorerUrl = 'http://localhost:3001';

const identity = new TDEXMnemonic(identityOpts);

describe('Integration tests with a local daemon', () => {
  test.skip('Should sell some LBTCs with a daemon', async () => {
    /*     const restoredMnemonic = await mnemonicRestorerFromEsplora(identity)({
          gapLimit: 30,
          esploraURL: explorerUrl,
        }); */

    // address
    //el1qqdjz2azu3wkwvsxpy499er7ar6rxwdwcn8cc2zcl3achutwuhv65rd6spsrf2lnsrddyrlhxahj0cluzczam2pt960mkdpa9u
    await identity.getNextAddress();
    const addresses = await identity.getAddresses();
    const utxos = await fetchAndUnblindUtxos(addresses, explorerUrl);
    // blidning
    // 48566cd9b86dfd4107d615bc4b929fc63347d72238a16844e657c60fe4593ffc
    const trade = new Trade({
      providerUrl: 'localhost:9945',
      explorerUrl,
      utxos,
      coinSelector: greedyCoinSelector(),
    });

    try {
      const txid = await trade.sell({
        market,
        amount: 5000,
        asset: market.baseAsset,
        identity,
      });
      console.log(txid);
      expect(txid).toBeDefined();
    } catch (e) {
      console.error(e);
    }

    /*     await sleep(1500);
    
        const txid3 = await trade.buy({
          market,
          amount: 10000,
          asset: market.baseAsset,
          identity,
        });
        console.log(txid3);
        expect(txid3).toBeDefined(); */
  }, 360000);
});
