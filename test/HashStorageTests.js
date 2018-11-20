const HashStorage = artifacts.require("HashStorage");
HashStorage.numberFormat = 'String';
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract('HashStorage', function(accounts) {
  var _contract, _ipfshash, _filehash, _dateAdded;

  beforeEach('Setup', async () => {
    //given
    _contract = await HashStorage.new();
    _ipfshash = 'IPFSHASH';
    _filehash = 'FILEHASH';
    _dateAdded = 1542652349;
  })

  describe("Adding", function() {
    it('Should add file info to contract', async () => {
      //when
      const tx = await _contract.add(_ipfshash, _filehash, _dateAdded);
      //then
      assert.isString(tx.tx);
      truffleAssert.eventEmitted(tx, 'HashAdded', (ev) => {
          return ev.ipfshash === _ipfshash && ev.filehash === _filehash && ev.dateAdded == _dateAdded;
      });
    });

    it('Should not add file info when file already exists', async () => {
      //given
      await _contract.add(_ipfshash, _filehash, _dateAdded);
      //when & then
      await truffleAssert.fails(
        _contract.add(_ipfshash, _filehash, _dateAdded),
        truffleAssert.ErrorType.REVERT,
        "this hash already exists in contract"
      );
    });

    it('Should not add file when user is not owner', async () => {
      //when & then
      await truffleAssert.fails(
        _contract.add(_ipfshash, _filehash, _dateAdded, {from: accounts[1]}),
        truffleAssert.ErrorType.REVERT,
        "Access Denied"
      );
    });
  })

  describe("Getting", function() {
    it('Should get file info from contract', async() => {
      //given
      await _contract.add(_ipfshash, _filehash, _dateAdded);
      //when
      const response = await _contract.get(_filehash);
      //then
      assert.equal(_filehash, response[0]);
      assert.equal(_ipfshash, response[1]);
      assert.equal(_dateAdded.toString(), response[2]);
      assert.isTrue(response[3]);
    });

    it('Should return empty values when file does not exist', async () => {
      //when
      const response = await _contract.get(_filehash);
      //then
      assert.equal(_filehash, response[0]);
      assert.equal('', response[1]);
      assert.equal('0', response[2]);
      assert.isFalse(response[3]);
    });
  })
});
