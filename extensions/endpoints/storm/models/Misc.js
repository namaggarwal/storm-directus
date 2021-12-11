module.exports =  function Misc(database) {
  const LINK_TABLE_NAME = 'custom_links';

  this.getCustomLinks = async function() {
    return database(LINK_TABLE_NAME).select([`title`, `value`]).orderBy('sort');
  }

}