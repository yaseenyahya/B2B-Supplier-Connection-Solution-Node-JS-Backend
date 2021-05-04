module.exports = (sequelize, DataTypes) => {
  const OfflineChatDetails = sequelize.define(
    "offlinechatdetails",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING,
        allowNulls: false,
      },
      pageId: {
        type: DataTypes.STRING,
        allowNulls: false,
      },
      messageId: {
        type: DataTypes.STRING,
        allowNulls: true,
      },
      messagetext: {
        type:  DataTypes.TEXT("long"),
        allowNulls: false,
      },
      messagetimestamp: {
        type: DataTypes.DATE,
        allowNulls: false,
      },
      messagetype: {
        type: DataTypes.STRING,
        allowNulls: false,
      }
    },
    {
      timestamps: true,
    }
  );

  return OfflineChatDetails;
};
