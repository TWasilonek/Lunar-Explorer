import baseJoi, { CustomHelpers } from "joi";

export const joi = baseJoi.extend(
  ...[
    {
      type: "object",
      base: baseJoi.object(),
      messages: {
        "object.base": "{{#label}} must be a valid JSON object",
      },
      coerce: {
        from: "string",
        method(value: string, helpers: CustomHelpers) {
          if (!value.startsWith("{") && !/^\s*\{/.test(value)) {
            return {
              value,
              errors: [helpers.error("object.base")],
            };
          }

          try {
            return { value: JSON.parse(value) };
          } catch (ignoreErr) {
            return {
              value,
              errors: [helpers.error("object.base")],
            };
          }
        },
      },
    },
    {
      type: "array",
      base: baseJoi.array(),
      messages: {
        "array.base": "must be a valid JSON array",
      },
      coerce: {
        from: "string",
        method(value: string, helpers: CustomHelpers) {
          if (
            typeof value !== "string" ||
            (!value.startsWith("[") && !/^\s*\[/.test(value))
          ) {
            return { value, errors: [helpers.error("array.base")] };
          }

          try {
            return { value: JSON.parse(value) };
          } catch (ignoreErr) {
            return { value, errors: [helpers.error("array.base")] };
          }
        },
      },
    },
  ]
);
