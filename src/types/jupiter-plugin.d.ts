export {};

interface JupiterFormProps {
  swapMode?: "ExactInOrOut" | "ExactIn" | "ExactOut";
  initialAmount?: string;
  initialInputMint?: string;
  initialOutputMint?: string;
  fixedAmount?: boolean;
  fixedMint?: string;
}

interface JupiterInitProps {
  displayMode?: "modal" | "integrated" | "widget";
  integratedTargetId?: string;
  formProps?: JupiterFormProps;
  enableWalletPassthrough?: boolean;
  branding?: {
    logoUri?: string;
    name?: string;
  };
  containerStyles?: {
    width?: string;
    height?: string;
    borderRadius?: string;
    overflow?: string;
  };
}

interface JupiterPlugin {
  init: (props: JupiterInitProps) => void;
  close: () => void;
  syncProps: (props: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    Jupiter?: JupiterPlugin;
  }
}
