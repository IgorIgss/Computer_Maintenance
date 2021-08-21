const mongoose = require('mongoose');

class Protocol {
  schema() {
    const computerMaintenanceProtocolSchema = new mongoose.Schema(
      {
        username: {
          type: String,
          required: true,
        },
        protocol: {
          type: String,
          required: true,
          unique: true,
        },
        numberOfOS: {
          type: String,
          required: true,
          unique: true,
        },
        deadline: {
          type: Date,
          required: true,
        },
        situation: {
          type: String,
          required: true,
        },
        sector: {
          type: String,
          required: true,
        },
        observations: {
          type: String,
          required: true,
        },
      },
      { timestamps: true }
    );

    return mongoose.model('Protocol', computerMaintenanceProtocolSchema);
  }
}

module.exports = new Protocol().schema();
