"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Clips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      clip_url: {
        allowNull: false,
        unique: true,
        type: Sequelize.TEXT
      },
      reactions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Clips");
  }
};
