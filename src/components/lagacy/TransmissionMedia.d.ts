declare module "./TransmissionMedia" {
  interface TransmissionMediaProps {
    mediaType: string;
    binaryData?: string;
  }
  
  export default function TransmissionMedia(props: TransmissionMediaProps): JSX.Element;
} 