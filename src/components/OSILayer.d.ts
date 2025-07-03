declare module "./OSILayer" {
  interface OSILayerProps {
    layer: {
      id: number;
      name: string;
      description: string;
      color: string;
      borderColor: string;
    };
    active: boolean;
    currentStep: number;
    direction: "sending" | "receiving";
    data: any;
    showDetailedView: boolean;
    mediaType?: string;
  }
  
  export default function OSILayer(props: OSILayerProps): JSX.Element;
} 