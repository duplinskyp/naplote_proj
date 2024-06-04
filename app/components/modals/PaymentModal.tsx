'use client';

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import usePaymentModal from "@/app/hooks/usePaymentModal";
import axios from "axios";

const PaymentModal = () => {
  const router = useRouter();
  const paymentModal = usePaymentModal();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      iban: '',
    },
  });
  
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const payload = {
      iban: data.iban,  // Assuming the IBAN input's name attribute is set as 'iban'
    };
  
    axios.post('/api/addPaymentInfo', payload)
      .then(() => {
        toast.success('IBAN updated successfully!');
        paymentModal.onClose();
      })
      .catch((error) => {
        // Ensure that only a string is passed to toast.error
        toast.error(`Error: ${error.response?.data?.message || error.message || 'Failed to update IBAN'}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  



  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Vložte platobné údaje"
        subtitle="Vložte IBAN kam vám budú vyplácané vaše zároboky z prenájmu."
      />

      <Input
        id="iban"
        label="xxxx-xxxx-xxxx-xxxx-xxxx"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={paymentModal.isOpen}
      title="Platobné údaje"
      actionLabel="Uložiť"
      onClose={paymentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default PaymentModal;
