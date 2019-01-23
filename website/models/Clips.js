"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Clips = sequelize.define(
    "Clips",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: { type: Sequelize.STRING, allowNull: false },
      clip_url: { allowNull: false, type: Sequelize.TEXT },
      message_id: { allowNull: false, type: Sequelize.STRING },
      clip_title: { allowNull: false, type: Sequelize.STRING },
      reactions: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    },
    {}
  );
  Clips.associate = function(models) {
    // associations can be defined here
  };
  return Clips;
};
