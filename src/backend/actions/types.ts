export interface IPerformsImplementation {
  label: string;
  configurationSchema: Record<string, string>;
  do: () => Promise<any>;
}

export interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: Record<string, string>;
  performsImplementation: Record<string, IPerformsImplementation>;
}

// Actions controller
// Activate
// Deactivate => WILL REMOVE ALL CONFIGURATIONS AND INTEGRATIONS, THIS IS NOT REVERSIBLE
// config
// register
// de-register
