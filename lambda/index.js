const Alexa = require("ask-sdk-core");

const axios = require("axios");
const { OPEN_WEATHER_API } = require("./config");
const { ddbAdapterInstance } = require("./db");

/**
 * The LaunchRequestHandler handles the launch of the skill and provides a welcome message to the user.
 */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Welcome, you can say Hello or Help. Which would you like to try?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * Add the city name to the DynamoDB table.
 * @param {*} handlerInput The handler input object.
 * @param {*} cityName The city name to be added.
 */
async function add(handlerInput, cityName) {
  const attributesManager = handlerInput.attributesManager;
  const persistentAttributes = {
    id: handlerInput.requestEnvelope.context.System.user.userId,
    city: cityName,
  };
  attributesManager.setPersistentAttributes(persistentAttributes);
  await attributesManager.savePersistentAttributes();
}

/**
 * Obtain the weather information for the city name.
 * @param {*} cityName The city name to obtain the weather information.
 * @returns The weather information for the city name.
 */
async function weather(cityName) {
  let response = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?appid=${OPEN_WEATHER_API}&q=${cityName}&units=metric`
  );
  if (response.status === 200) {
    let weather = response.data;
    let speakOutput = `It's ${Math.round(
      weather.main.temp
    )} degrees and the weather is ${weather.weather[0].description} in ${
      weather.name
    }!`;
    let reprompt = " Want to try again or you can say cancel to quit.";
    return speakOutput + reprompt;
  } else {
    return "Want to try again or you can say cancel to quit.";
  }
}

/**
 * The HelloWorldIntentHandler handles the HelloWorldIntent and provides the weather information for the city name.
 */
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "HelloWorldIntent"
    );
  },
  async handle(handlerInput) {
    const city = handlerInput.requestEnvelope.request.intent.slots.input.value;
    const speakOutput = await weather(city);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt("Would you like to save it?")
      .getResponse();
  },
};

/**
 * The SaveIntentHandler handles the SaveIntent and saves the city name to the DynamoDB table.
 */
const SaveIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "SaveIntent"
    );
  },
  async handle(handlerInput) {
    let response = "";
    const city = handlerInput.requestEnvelope.request.intent.slots.input.value;

    try {
      await add(handlerInput, city);
      response = `"${city}" save successfully!`;
    } catch (err) {
      response = "an error occurred";
    }

    return handlerInput.responseBuilder.speak(response).getResponse();
  },
};

/**
 * The HelpIntentHandler provides a help message to the user.
 */
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "You can say hello to me! How can I help?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * The CancelAndStopIntentHandler handles the CancelIntent and StopIntent and provides a goodbye message to the user.
 */
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, I don't know about that. Please try again.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    SaveIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/hello-world/v1.2")
  .withPersistenceAdapter(ddbAdapterInstance)
  .lambda();
