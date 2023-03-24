function acceptedValues(valueArray, msg) {
  return {
    isIn: {
      args: [valueArray],
      msg,
    },
  };
}

module.exports = {
  acceptedValues,
};
