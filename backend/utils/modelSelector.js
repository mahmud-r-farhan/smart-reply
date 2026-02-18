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
    friendly: "in a warm, approachable, and genuinely friendly tone. Be encouraging and personable, using inclusive and positive language that makes the recipient feel valued, comfortable, and at ease.",
    formal: "in a formal, respectful tone suitable for official correspondence",
    flating: "as a playful, flirtatious compliment that shows romantic interest while staying tasteful and respectful — charming but never inappropriate",
    romantic: "as a heartfelt romantic expression conveying genuine affection and emotional depth — intimate and sincere, not generic or clichéd"
  };
  
  return instructions[lowerFormat] || instructions.professional;
};
