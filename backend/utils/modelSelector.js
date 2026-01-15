export const MODELS = {
  SUGGESTIONS: {
    models: [
      "xiaomi/mimo-v2-flash:free",
      "tngtech/deepseek-r1t2-chimera:free",
      "openai/gpt-oss-20b:free"
    ],
    default: "xiaomi/mimo-v2-flash:free"
  },
  ENHANCEMENTS: {
    models: [
      "xiaomi/mimo-v2-flash:free",
      "tngtech/deepseek-r1t2-chimera:free",
      "openai/gpt-oss-20b:free"
    ],
    default: "tngtech/deepseek-r1t2-chimera:free"
  },
  TRANSLATIONS: {
    models: [
      "openai/gpt-oss-20b:free",
      "xiaomi/mimo-v2-flash:free",
      "tngtech/deepseek-r1t2-chimera:free"
    ],
    default: "openai/gpt-oss-20b:free"
  }
};

// Supported formats/tones
export const FORMATS = {
  PROFESSIONAL: "professional",
  CASUAL: "casual",
  FRIENDLY: "friendly",
  FORMAL: "formal",
  FLATING: "flating",
  ROMANTIC: "romantic"
};

export const VALID_FORMATS = Object.values(FORMATS);

/* Get a model for the specified operation type */
export const getModel = (operationType, index = 0) => {
  const operation = MODELS[operationType];
  if (!operation) {
    throw new Error(`Unknown operation type: ${operationType}`);
  }
  
  const selectedIndex = index % operation.models.length;
  return operation.models[selectedIndex];
};

/* Get default model for the specified operation type */
export const getDefaultModel = (operationType) => {
  const operation = MODELS[operationType];
  if (!operation) {
    throw new Error(`Unknown operation type: ${operationType}`);
  }
  return operation.default;
};

/* Validate if format is supported */
export const isValidFormat = (format) => {
  return VALID_FORMATS.includes(format.toLowerCase());
};

/* Get all available formats */
export const getAvailableFormats = () => {
  return VALID_FORMATS;
};

// Get format instruction for the LLM

export const getFormatInstruction = (format) => {
  const lowerFormat = format.toLowerCase();
  
  const instructions = {
    professional: "in a professional, business-appropriate tone",
    casual: "in a casual, conversational tone",
    friendly: "in a friendly, warm tone",
    formal: "in a formal, respectful tone",
    flating: "as a flirty/flating compliment that shows romantic interest while remaining respectful",
    romantic: "as a romantic expression that conveys affection and emotional depth"
  };
  
  return instructions[lowerFormat] || instructions.professional;
};
