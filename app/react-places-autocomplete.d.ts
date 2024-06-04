// react-places-autocomplete.d.ts
declare module 'react-places-autocomplete' {
    export function geocodeByAddress(address: string): Promise<any>;
    export function getLatLng(result: any): Promise<any>;
    export default function PlacesAutocomplete(props: any): JSX.Element;
  }
  