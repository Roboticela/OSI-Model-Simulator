import { ReactElement } from 'react';

export interface OSILayerProps {
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
  data: {
    originalMessage: string;
    layers: {
      [key: number]: {
        sending: {
          data: string;
          protocols: string;
          processes: string[];
          rawData?: string;
          addedData?: string;
          finalData?: string;
          binaryRepresentation?: string;
          signalPattern?: string;
          handshakeData?: {
            syn: string;
            synAck: string;
            ack: string;
          };
        };
        receiving: {
          data: string;
          protocols: string;
          processes: string[];
          rawData?: string;
          addedData?: string;
          finalData?: string;
          binaryRepresentation?: string;
          signalPattern?: string;
        };
      };
    };
  } | null;
  showDetailedView: boolean;
  mediaType?: string;
  id?: string;
}

export default function OSILayer(props: OSILayerProps): ReactElement; 