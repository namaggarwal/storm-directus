module.exports = function MiscService(miscModel) {
  this.getCustomLinks = async function() {
    return miscModel.getCustomLinks();
  }
}