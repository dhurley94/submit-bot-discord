"use strict";

const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define(
    "Users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profile_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      clipsPosted: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      numClips: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {}
  );
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
