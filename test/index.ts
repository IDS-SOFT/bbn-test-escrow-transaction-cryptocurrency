const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cryptocurrency", function () {
  let Cryptocurrency: any;
  let cryptocurrency: any;
  let owner: any;
  let user1: any;
  let user2: any;

  //   before(async function () {
  // });

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    Cryptocurrency = await ethers.getContractFactory("Cryptocurrency");
    cryptocurrency = await Cryptocurrency.deploy();
    await cryptocurrency.deployed();
  });

  it("Should deposit cryptocurrency", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await cryptocurrency.deposit({ value: depositAmount });

    const balance = await cryptocurrency.balances(owner.address);
    expect(balance).to.equal(depositAmount);
  });

  it("Should transfer cryptocurrency", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await cryptocurrency.deposit({ value: depositAmount });
    const initialBalanceUser1 = await cryptocurrency.balances(user1.address);
    const transferAmount = ethers.utils.parseEther("0.5");

    await cryptocurrency.connect(owner).transfer(user1.address, transferAmount);

    const finalBalanceUser1 = await cryptocurrency.balances(user1.address);
    const finalBalanceOwner = await cryptocurrency.balances(owner.address);

    expect(finalBalanceUser1).to.equal(initialBalanceUser1.add(transferAmount));
    expect(finalBalanceOwner).to.equal(depositAmount.sub(transferAmount));
  });

  it("Should create and release escrow", async function () {
    const escrowAmount = ethers.utils.parseEther("1");
    await cryptocurrency.deposit({ value: escrowAmount });
    await cryptocurrency
      .connect(owner)
      .createEscrow(user1.address, escrowAmount);

    await cryptocurrency.connect(owner).releaseEscrow();
    const sellerBalance = await cryptocurrency.balances(user1.address);
    const escrowReleased = await cryptocurrency.escrowReleased();

    expect(sellerBalance).to.equal(escrowAmount);
    expect(escrowReleased).to.be.true;
  });

  it("Should create and refund escrow", async function () {
    const escrowAmount = ethers.utils.parseEther("1");
    await cryptocurrency.connect(owner).deposit({ value: escrowAmount });
    await cryptocurrency
      .connect(owner)
      .createEscrow(user1.address, escrowAmount);

    await cryptocurrency.connect(user1).refundEscrow();
    const buyerBalance = await cryptocurrency.balances(owner.address);
    const escrowReleased = await cryptocurrency.escrowReleased();

    expect(buyerBalance).to.equal(BigInt(2 * escrowAmount));
    expect(escrowReleased).to.be.true;
  });
});
