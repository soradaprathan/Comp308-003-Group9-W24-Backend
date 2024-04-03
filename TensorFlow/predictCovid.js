const tf = require("@tensorflow/tfjs");
const data = require("../Data/covidDataConverted.json"); // Ensure the correct path

exports.trainAndPredict = async function (req, res) {
  var newData = data.slice(0, 200);
  var input = req.body.input;

  console.log(input);

  // Preparing Data

  const trainingData = tf.tensor2d(
    newData.map((item) => [
      item.shortnessOfBreath,
      item.feverOrChills,
      item.dryCough,
      item.soreThroat,
      item.congestionOrRunnyNose,
      item.Headache,
      item.Fatigue,
      item.muscleOrBodyAches,
      item.lossOfTasteOrSmell,
    ])
  );

  const outputData = tf.tensor2d(
    newData.map((item) => [item.risk === "Yes" ? 1 : 0])
  );

  const testingData = tf.tensor2d(
    input.map((item) => [
      item.shortnessOfBreath,
      item.feverOrChills,
      item.dryCough,
      item.soreThroat,
      item.congestionOrRunnyNose,
      item.Headache,
      item.Fatigue,
      item.muscleOrBodyAches,
      item.lossOfTasteOrSmell,
    ])
  );

  // 2. Make a Model

  const model = tf.sequential();

  //add the first layer
  model.add(
    tf.layers.dense({
      inputShape: [9], // four input neurons
      activation: "sigmoid",
      units: 6, //dimension of output space (first hidden layer)
    })
  );

  //add the hidden layer
  model.add(
    tf.layers.dense({
      inputShape: [6], //dimension of hidden layer
      activation: "sigmoid",
      units: 3,
    })
  );

  //add output layer
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 1,
    })
  );

  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(0.0001),
  });

  // 3. Run the model on data and predict

  async function run() {
    const startTime = Date.now();
    //train the model
    disp = await model.fit(trainingData, outputData, {
      epochs: 200,
      callbacks: {
        //list of callbacks to be called during training
        onEpochEnd: async (epoch, log) => {
          lossValue = log.loss;
          console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
          elapsedTime = Date.now() - startTime;
          console.log("elapsed time: " + elapsedTime);
        },
      },
    });

    const results = model.predict(testingData);

    console.log(results);

    results.array().then((array) => {
      console.log(array);
      return res.send(array);
    });
  }
  run();
};
