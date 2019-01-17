'use strict';
module.exports = (sequelize, DataTypes) => {
  const Clips = sequelize.define('Clips', {
    username: DataTypes.STRING,
    clip_url: DataTypes.TEXT,
    upvotes: DataTypes.INTEGER
  }, {});
  Clips.associate = function(models) {
    // associations can be defined here
  };
  return Clips;
};