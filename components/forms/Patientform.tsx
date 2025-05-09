"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomForm from "@/components/ui/CustomForm";
import SubmitButton from "@/components/ui/SubmitButton"
import { useState } from "react";
import {UserFormValidation} from "@/lib/Validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { ToastContainer, toast } from 'react-toastify';
export enum FieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}
const notify = (message:string) => toast.error(message);
const Patientform = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    console.log("Submitting form:", values); // ✅ Debugging step
    setIsLoading(true);

    try {
      const user = await createUser(values);
      console.log("User created:", user); // ✅ Debugging step

      if (user) {
        router.push(`/patients/${user.$id}/register`);
      }
    } catch (err) {
      console.error("Error creating user:", err);
      notify("Error creating user!");
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header text-red-300">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your appointment</p>
        </section>

        <CustomForm 
          fieldType={FieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Full Name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomForm 
          fieldType={FieldType.INPUT}
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="abc@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomForm 
          fieldType={FieldType.PHONE_INPUT}
          control={form.control}
          name="phone"  // ✅ Fixed name
          label="Phone Number"
          placeholder="+1-99933399393"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        <ToastContainer/>
      </form>
    </Form>
  );
}

export default Patientform;
