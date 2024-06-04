'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from "react";

import useRentModal from '@/app/hooks/useRentModal';

import Modal from "./Modal";
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from "../inputs/CountrySelect";
import { categories } from '../navbar/Categories';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import Heading from '../Heading';
import Checkbox from '../inputs/Checkbox';
import useCities from '@/app/api/useCities';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);
  const { cities, loading } = useCities('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      dimensionsX: 1,
      dimensionsY: 1,
      politics: false,
      adultContent: false,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
      locationValue: '', // Pridané pre uloženie hodnoty mesta
      coordinates: [], // Pridané pre uloženie súradníc
    }
  });

  const location = watch('location');
  const category = watch('category');
  const imageSrc = watch('imageSrc');

  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
  }), [location]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const handleCityChange = (city: any) => {
    setCustomValue('location', city);
    setValue('locationValue', city.label); // Použitie `city.label` alebo inú vhodnú hodnotu
    setValue('coordinates', city.latlng);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    const payload = {
      ...data,
      locationValue: data.location.label, // Použitie hodnoty location
      coordinates: data.location.latlng, // Použitie súradníc location
    };

    axios.post('/api/listings', payload)
      .then(() => {
        toast.success('Listing created!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return 'Späť';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Ktorá z kategórii najviac vystihuje vašu plochu?"
        subtitle="Zvoľte kategóriu"
      />
      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) =>
                setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Kde sa nachádza vaša plocha?"
          subtitle="Uľahčite hľadanie záujemcom!"
        />
        <CountrySelect
          value={location}
          onChange={handleCityChange} // Použitie handleCityChange na nastavenie hodnoty a súradníc
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Popíšte lokalitu, viditeľnosť plochy a pod."
          subtitle="Prečo by si mal záujemca vybrať práve vašu plochu pre inzerciu?"
        />
        <Input
          id="dimensionsX"
          label="Šírka plochy (cm)"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="dimensionsY"
          type="number"
          label="Výška plochy (cm)"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Ako by ste opísali vašu plochu a lokáciu kde sa nachádza?"
          subtitle="Je to orientované k rušnej ceste? Alebo napríklad smerom na kultúrnu pamiatku?"
        />
        <Input
          id="title"
          label="Názov"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Popis"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Heading
          title="Povolené typy reklám na vašej ploche."
          subtitle="Vaše preferencie sú pre nás dôležité. Prosím, označte nižšie uvedené možnosti podľa toho, aké typy reklám si prajete umožniť na vašej ploche. Rešpektujeme vaše rozhodnutia a zaručujeme, že budú dodržané pri výbere reklám na vašu plochu."
        />
        <Checkbox
          id="politics"
          label={<span>Súhlasím s poskytnutím mojej plochy pre <strong> politické reklamné kampane</strong>.</span>}
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Checkbox
          id="adultContent"
          label={<span>Súhlasím s poskytnutím mojej plochy pre <strong> reklamy zamerané na dospelých.</strong></span>}
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Cena"
          subtitle="Koľko je cena za prenájom vaše plochy (mesačne) ?"
        />
        <Input
          id="price"
          label="€ / mesiac"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Prenajímajte svoju plochu!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
