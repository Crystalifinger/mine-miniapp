// MINE Mining Arena — static UI prototype only.
// All balances and purchases below are local demo state. No blockchain is connected.

const miners = [
  { id: "starter", name: "Starter Rig", icon: "⌘", rarity: "Common", power: 12.5, rate: "0.8 / h", description: "A dependable first rig for new miners.", prices: { MINE: 40, TON: 0.35 } },
  { id: "neon", name: "Neon Hashbox", icon: "▣", rarity: "Rare", power: 45, rate: "2.4 / h", description: "A compact rig with a higher mining output.", prices: { MINE: 150, ATF: 80 } },
  { id: "quantum", name: "Quantum Core", icon: "✧", rarity: "Epic", power: 120, rate: "6.7 / h", description: "An advanced platform miner for dedicated players.", prices: { MINE: 420, MRG: 250, VIC: 100 } }
];

const listings = [
  { id: 1, name: "Neon Hashbox", seller: "Miner_074", icon: "▣", power: "45 TH/s", price: 95 },
  { id: 2, name: "Starter Rig", seller: "TONRider", icon: "⌘", power: "12.5 TH/s", price: 28 },
  { id: 3, name: "Quantum Core", seller: "HashFox", icon: "✧", power: "120 TH/s", price: 360 }
];

const state = { mine: 125, power: 12.5, owned: 1, selectedPay: {}, claimedTask: false, walletConnected: false };
const $ = (id) => document.getElementById(id);
const fmt = (n) => Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
}

function renderStats() {
  $("mineBalance").textContent = fmt(state.mine);
  $("powerValue").innerHTML = `${fmt(state.power)} <i>TH/s</i>`;
  $("ownedCount").textContent = state.owned;
}

function renderMiners() {
  $("minerGrid").innerHTML = miners.map(miner => {
    const options = Object.entries(miner.prices).map(([token, amount]) =>
      `<button class="pay-option ${state.selectedPay[miner.id] === token ? "selected" : ""}" data-pay="${token}" data-miner="${miner.id}">${token} · ${amount}</button>`
    ).join("");
    const token = state.selectedPay[miner.id] || Object.keys(miner.prices)[0];
    const amount = miner.prices[token];
    return `<article class="miner-card">
      <div class="miner-top"><div class="miner-icon">${miner.icon}</div><span class="rarity">${miner.rarity}</span></div>
      <h3>${miner.name}</h3><p class="miner-desc">${miner.description}</p>
      <div class="miner-stats"><span>Mining power<strong>${miner.power} TH/s</strong></span><span>Demo output<strong>${miner.rate}</strong></span></div>
      <div class="price-label">Choose a supported payment token</div><div class="pay-options">${options}</div>
      <button class="buy-button" data-buy="${miner.id}">Buy for ${amount} ${token}</button>
    </article>`;
  }).join("");
}

function renderMarket() {
  $("marketList").innerHTML = listings.map(item => `<article class="market-item">
    <div class="market-name"><span class="market-symbol">${item.icon}</span><div><strong>${item.name}</strong><small>Seller: ${item.seller} · ${item.power}</small></div></div>
    <div class="market-price">${item.price} MINE<small>Marketplace price</small></div>
    <button class="small-button" data-listing="${item.id}">Buy listing</button>
  </article>`).join("");
}

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll(".tab").forEach(el => el.classList.toggle("active", el === tab));
    document.querySelectorAll(".panel").forEach(el => el.classList.toggle("active", el.id === tab.dataset.tab));
  }

  const scroll = event.target.closest("[data-scroll]");
  if (scroll) {
    const id = scroll.dataset.scroll;
    document.querySelector(`.tab[data-tab="${id}"]`).click();
    document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const pay = event.target.closest("[data-pay]");
  if (pay) {
    state.selectedPay[pay.dataset.miner] = pay.dataset.pay;
    renderMiners();
  }

  const buy = event.target.closest("[data-buy]");
  if (buy) {
    const miner = miners.find(item => item.id === buy.dataset.buy);
    const token = state.selectedPay[miner.id] || Object.keys(miner.prices)[0];
    if (token === "MINE") {
      if (state.mine < miner.prices[token]) return toast("Not enough demo MINE balance.");
      state.mine -= miner.prices[token];
    } else {
      return toast(`Demo only: ${miner.name} would be purchased with ${token}. No real token was charged.`);
    }
    state.owned += 1;
    state.power += miner.power;
    renderStats();
    renderMiners();
    toast(`Demo purchase successful: ${miner.name}. No real transaction occurred.`);
  }

  const listing = event.target.closest("[data-listing]");
  if (listing) {
    const item = listings.find(entry => entry.id === Number(listing.dataset.listing));
    if (state.mine < item.price) return toast("Not enough demo MINE balance.");
    state.mine -= item.price;
    state.owned += 1;
    const miner = miners.find(entry => entry.name === item.name);
    if (miner) state.power += miner.power;
    listings.splice(listings.findIndex(entry => entry.id === item.id), 1);
    renderStats();
    renderMarket();
    toast(`Demo listing purchased for ${item.price} MINE. No real tokens were transferred.`);
  }
});

$("walletButton").addEventListener("click", () => {
  toast("Wallet connection is not implemented in this static prototype.");
});

$("claimTask").addEventListener("click", () => {
  if (state.claimedTask) return toast("You already claimed this demo task.");
  state.claimedTask = true;
  state.mine += 5;
  $("claimTask").textContent = "Claimed";
  $("claimTask").disabled = true;
  renderStats();
  toast("+5 demo MINE added. This is not a real token reward.");
});

renderStats();
renderMiners();
renderMarket();
