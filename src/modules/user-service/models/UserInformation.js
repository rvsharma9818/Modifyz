const { DataTypes } = require("sequelize");
const { GENDER, USER_INFORMATION } = require("../../../common/constant");
const db = require("../../../common/db/database");
const { acceptedValues } = require("../../../common/utils/modelValidators");
const User = require("./User");

const UserInformation = db.sequelize.define(
  "UserInformation",
  {
    userInformationId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: USER_INFORMATION.FIRST_NAME,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        ...acceptedValues(Object.values(GENDER), "Invalid Gender"),
      },
    },
    streetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    houseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aditionalDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "user_informations",
  }
);

// User.hasOne(UserInformation, {
//   foreignKey: "userId",
//   as: "user",
// });

// UserInformation.sync({ alter: true });
// UserInformation.sync({ force: true });

module.exports = UserInformation;
