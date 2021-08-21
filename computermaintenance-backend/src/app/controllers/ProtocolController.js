const neo4j = require('neo4j-driver');
const ProtocolModel = require('../models/Protocol');

console.log(`bolt://${process.env.NEO4J_LOCAL_IP}`);

const driver = neo4j.driver(
  process.env.NEO4J_LOCAL_IP
    ? `bolt://${process.env.NEO4J_LOCAL_IP}`
    : 'bolt://192.168.2.8',
  neo4j.auth.basic('neo4j', 'streams')
);

const session = driver.session({
  database: 'neo4j',
  defaultAccessMode: neo4j.session.WRITE,
});
class ProtocolController {
  async registerDataProtocol(req, res) {
    const { protocol, numberOfOS } = req.body;

    const protocolExists = await ProtocolModel.findOne({ protocol });
    const numberOfOSExists = await ProtocolModel.findOne({
      numberOfOS,
    });

    if (protocolExists || numberOfOSExists) {
      return res.status(400).json({ error: 'Protocol already exists.' });
    }

    const data = await ProtocolModel.create(req.body);

    if (!data) {
      return res.status(400).json({ error: 'Error saving records.' });
    }

    session
      .run(
        'CREATE(n:Protocols { protocol: $protocolParam, numberOfOS: $numberOfOSParam, situation: $situationParam, sector: $sectorParam, deadline: $deadlineParam, observations: $observationsParam, username: $usernameParam }) RETURN n.protocol',
        {
          protocolParam: data.protocol,
          numberOfOSParam: data.numberOfOS,
          situationParam: data.situation,
          sectorParam: data.sector,
          deadlineParam: String(data.deadline),
          observationsParam: data.observations,
          usernameParam: data.username,
          createdAtParam: String(data.createdAt),
          updatedAtParam: String(data.updatedAt),
        }
      )
      .then(async () => {
        await session.close();
      })
      .catch((err) => new Error(err));

    return res.json(data);
  }

  async updateProtocol(req, res) {
    const { id } = req.params;

    const protocol = await ProtocolModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!protocol) {
      return res.status(400).json({ error: 'Error updating protocol.' });
    }

    return res.json(protocol);
  }

  async deleteProtocol(req, res) {
    const { id } = req.params;

    const protocol = await ProtocolModel.findByIdAndDelete({
      _id: id,
    });

    if (!protocol) {
      return res.status(400).json({ error: 'Error deleting protocol.' });
    }

    return res.send();
  }

  async listAllProtocols(req, res) {
    const protocols = await ProtocolModel.find({}, '-__v').sort({
      name: 'ASC',
      calledDuration: 'ASC',
    });

    if (!protocols) {
      return res.status(400).json({ error: 'Error listing protocols.' });
    }

    return res.json(protocols);
  }

  async listProtocol(req, res) {
    const { protocol } = req.params;

    const protocolData = await ProtocolModel.findOne(
      {
        protocol,
      },
      '-__v'
    );

    if (!protocolData) {
      return res.status(400).json({ error: 'Error listing protocol.' });
    }

    return res.json(protocolData);
  }
}

module.exports = new ProtocolController();
