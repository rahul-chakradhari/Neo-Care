"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomForm from "@/components/ui/CustomForm";
import SubmitButton from "@/components/ui/SubmitButton"
import { useState } from "react";
import {CreateAppointmentSchema, getAppointmentSchema, UserFormValidation} from "@/lib/Validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import Image from "next/image"
import {SelectItem} from "@/components/ui/select"
import {Doctors} from "@/constants"
import { CreateAppointment } from "@/lib/actions/appointment.actions"
export enum FieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}

const AppointmentForm = ({userId,patientId,type}:{userId:string,patientId:string,type:"create" | "cancel"|"schedule"}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      schedule : new Date(),
      reason : "",
      note: "",
      cancellationReason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    console.log("Submitting form:", values); // ✅ Debugging step
    setIsLoading(true);
    let status;
    switch (type) {
      case "cancel":
        status = "cancelled";
        break;
      case "schedule":
        status = "scheduled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      console.log("Creating user..."); // ✅ Debugging step
      const user = await createUser(values);
      console.log("User created:", user); // ✅ Debugging step

      if (type === 'create' && patientId) {
        console.log("Creating appointment..."); // ✅ Debugging step
        const appointmentData = {
          userId: user.$id,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason,
          note: values.note,
          status: status as Status,
        };
        const appointment = await CreateAppointment(appointmentData);
        console.log("Appointment created:", appointment); // ✅ Debugging step
        if (appointment) {
          form.reset();
          router.push(`/patients/${user.$id}/new-appointment/success?appointmentId=${appointment.$id}`);
        } else {
          console.error("Failed to create appointment."); // ✅ Debugging step
        }
      }
    } catch (err) {
      console.error("Error in onSubmit:", err); // ✅ Improved error logging
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;
  switch (type) {
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break; // ✅ Added missing break
    default:
      buttonLabel = "Submit"; // ✅ Added default case
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header text-red-300">Hey there!! 👋</h1>
          <p className="text-dark-700">Request a new appointment in a few seconds</p>
        </section>
        {type !== "cancel" &&(
          <>
          <CustomForm 
            fieldType={FieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
            </CustomForm>

            <div className="flex flex-col gap-6 xl:flex-row">
        <CustomForm 
          fieldType={FieldType.TEXTAREA}
          control={form.control}
          name="reason"
          label="Reason for Appointment"
          placeholder="Routine checkup, etc."
          iconAlt="reason"
        />
        <CustomForm 
          fieldType={FieldType.TEXTAREA}
          control={form.control}
          name="note"
          label="Additional Notes"
          placeholder="Any requests or additional information"
          iconAlt="additionalInfo"
          
        />
        
        </div>
        <CustomForm 
          fieldType={FieldType.DATE_PICKER}
          control={form.control}
          name="schedule"  // ✅ Fixed name
          label="Expected appointment date"
          showTimeSelect
          dateFormat="MMMM d, yyyy - h:mm aa"
          placeholder="Select appointment date"
        />
          </>
        )}
          {type === "cancel" && (
            <>
            
            <CustomForm
              fieldType={FieldType.INPUT}
              control={form.control}
              name="cancellationReason"
              label="Reason for cancellation"
              placeholder="Reason for cancelling the appointment"
            />

</>
          )}
        
        

        

          <SubmitButton
          isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
        
      </form>
    </Form>
  );
}

export default AppointmentForm;
