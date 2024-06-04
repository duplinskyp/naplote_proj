'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from '../Heading';
import SimpleInput from '../inputs/SimpleInputs';

enum STEPS {
  LOCATION = 0,
  // DATE = 1,
  INFO = 1,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState<CountrySelectValue>();
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);
  const [dimensionX, setDimensionX] = useState('');
  const [dimensionY, setDimensionY] = useState('');

  const Map = useMemo(() => dynamic(() => import('../Map'), { 
    ssr: false 
  }), []);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const parsedDimensionX = dimensionX ? parseFloat(dimensionX) : undefined;
    const parsedDimensionY = dimensionY ? parseFloat(dimensionY) : undefined;

    console.log(`Parsed dimensionX: ${parsedDimensionX}, dimensionY: ${parsedDimensionY}`);

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.label || '',
      coordinates: coordinates || [],
      dimensionsX: parsedDimensionX, // Zmena na dimensionsX
      dimensionsY: parsedDimensionY  // Zmena na dimensionsY
    };

    console.log('Updated Query:', updatedQuery);

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [step, searchModal, location, router, coordinates, dimensionX, dimensionY, onNext, params]);

  const handleMapClick = (latlng: [number, number]) => {
    console.log('Map clicked:', latlng);
    setCoordinates(latlng);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="V akej lokalite hľadáte plochu?"
        subtitle="Najdite atraktívnu pozíciu pre vášu reklamu!"
      />
      <CountrySelect 
        value={location} 
        onChange={(value) => setLocation(value as CountrySelectValue)} 
      />
      <hr />
      <Map center={location?.latlng} onClick={handleMapClick} />
    </div>
  );

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Akú veľku plochu hľadáte?"
          subtitle="Chcete nalepiť malý banner? Alebo niekoľko metrový pútač?"
        />
        <SimpleInput
          id="dimensionsX"
          label="šírka (cm)"
          type="number"
          value={dimensionX}
          onChange={(e) => setDimensionX(e.target.value)}
        />
        <SimpleInput
          id="dimensionsY"
          label="výška (cm)"
          type="number"
          value={dimensionY}
          onChange={(e) => setDimensionY(e.target.value)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
}

export default SearchModal;
