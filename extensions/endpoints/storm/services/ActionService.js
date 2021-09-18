module.exports = function ActionService(actionModel) {
  this.addAction = async function(data) {
    return actionModel.addAction(data);
  }
}