export class ModelController {
  getModelMenuItems() {
    return [{ label: "Model 1", value: "model-1" }];
  }
}

export const modelController = new ModelController();
