module.exports = function ActionService(actionModel) {
  this.addAction = async function(data) {
    return actionModel.addAction(data);
  }

  this.getAllActions = async function() {
    const actions = await actionModel.getAllActions();
    return actions.map((action) => ([action.title, action.value]));
  }
}