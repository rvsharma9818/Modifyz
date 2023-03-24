const db = require("../../../common/db/database");
const { DataTypes } = require("sequelize");
const { generateHash } = require("../../../common/utils/helper");

const User = db.sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    hooks: {
      beforeCreate: async (record, options) => {
        record.dataValues.password = await generateHash(
          record.dataValues.password
        );
      },
      beforeUpdate: async (record, options) => {
        record.dataValues.password = await generateHash(
          record.dataValues.password
        );
      },
    },
  }
);

// User.sync({ alter: true });
// User.sync({ force: true });

module.exports = User;
