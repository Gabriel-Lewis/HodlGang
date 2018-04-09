const filter = {
  urls: [
    '*://*.coinbase.com/*',
    '*://*.gdax.com/*',
    '*://*.coinmarketcap.com/*',
    '*://*.kraken.com/*',
    '*://*.binance.com/*',
    '*://*.huobi.pro/*',
    '*://*.cointracker.io/*',
    '*://*.cryptocompare.com/*',
    '*://*.coincheckup.com/*',
    '*://*.coindesk.com/*',
    '*://*.reddit.com/r/CryptoCurrency/*',
    '*://*.coingecko.com/*',
    '*://*.kucoin.com/*',
    '*://*.bitfinex.com/*',
    '*://*.bithumb.com/*',
    '*://*.bittrex.com/*',
    '*://*.bitstamp.net/*',
    '*://*.hitbtc.com/*',
    '*://*.localbitcoins.com/*',
    '*://*.localethereum.com/*',
    '*://*.poloniex.com/*',
    '*://*.gemini.com/*',
    '*://*.OKCoin.com/*',
    '*://*.elixirtoken.io/*',
    '*://*.robinhood.com/*',
    '*://*.bitcoin.com/*',
    '*://*.coinone.co.kr/*',
    '*://*.bitflyer.jp/*',
    '*://*.quoinex.com/*',
    '*://*.wex.nz/*',
    '*://*.bitcointalk.org/*',
    '*://*.bitcoinwisdom.com/*',
    '*://*.tokenmarket.net/*',
    '*://*.coinmarketcal.com/*',
    '*://*.reddit.com/r/Bitcoin/',
    '*://*.coinspectator.com/*',
    '*://*.etherscan.io/*',
    '*://*.blockchain.info/*',
    '*://*.shapeshift.io/*'
  ],
};

let isHodling = true
chrome.storage.local.get({isHodling: true}, function(result) {
    isHodling = result.isHodling
});

const opt = ['blocking']

chrome.browserAction.onClicked.addListener(sendfunc);

function sendfunc(tab) {
  if (isHodling) {
    chrome.storage.local.set({
      isHodling: false
    })
  } else {
    chrome.storage.local.set({
      isHodling: true
    })
  }
}


chrome.storage.onChanged.addListener((changes, areaName) => {
  isHodling = changes.isHodling.newValue;
  updateIcon(changes.isHodling.newValue);
})

const updateIcon = (isHodling = true) => {
  const file = isHodling ? 'bitcoin.png' : 'grayBitcoin.png'
  const title = isHodling ? 'HODLING ON' : 'HODLING OFF!'
  chrome.browserAction.setIcon({ path: { "128": file } });
  chrome.browserAction.setTitle({ title })

  if (isHodling) {
    chrome.webRequest.onBeforeRequest.addListener(
      listener,
      filter,
      opt
    );
  } else {
    chrome.webRequest.onBeforeRequest.removeListener(listener)
  };
}

const listener = (page) => {
  return {
    redirectUrl: chrome.extension.getURL("hodlReminder.html"),
  };
}

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: chrome.extension.getURL("hodlReminder.html")}, function (tab) {
        console.log("New tab launched with http://yoursite.com/");
        chrome.storage.local.set({
          isHodling: true
        })
    });
});

chrome.runtime.onStartup.addListener((object) => {
  console.log("hello");
  chrome.storage.local.get({isHodling: true}, function(result) {
    updateIcon(result.isHodling)
  });
});
