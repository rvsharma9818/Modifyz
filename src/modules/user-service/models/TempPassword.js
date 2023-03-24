const { DataTypes } = require("sequelize");
const { GENDER, USER_INFORMATION } = require("../../../common/constant");
const db = require("../../../common/db/database");
const { acceptedValues } = require("../../../common/utils/modelValidators");
const User = require("./User");

const TempPassword = db.sequelize.define(
  "TempPassword",
  {
    otpId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    tableName: "temp_password",
  }
);

;

// TempPassword.sync({ alter: true });
// TempPassword.sync({ force: true });

module.exports = TempPassword;
