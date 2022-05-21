import { IJsonSchema } from "./types";


let JSON_SCHEMA: IJsonSchema;

export const refreshSchema = () => {
    JSON_SCHEMA = null;
}

export const loadJsonSchema = () : IJsonSchema => {
    if(JSON_SCHEMA){
        return JSON_SCHEMA;
    }
    JSON_SCHEMA = require("../../.schema/schema.json");
    return JSON_SCHEMA;
};
