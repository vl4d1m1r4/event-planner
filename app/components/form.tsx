import { Form } from "@remix-run/react";
import { FormField } from "./form-field";

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserFormProps {
  formData: UserData;
  formError: string;
  action: string;
  errors: UserData;
}

export function UserForm({ formData, formError, errors, action }: UserFormProps) {
  return (
    <Form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {formError}
      </div>
      <FormField
        htmlFor="email"
        label="Email"
        value={formData.email}
        error={errors?.email}
      />

      <FormField
        htmlFor="password"
        type="password"
        label="Password"
        value={formData.password}
        error={errors?.password}
      />

      {action === "register" && (
        <>
          <FormField
            htmlFor="firstName"
            label="First Name"
            value={formData.firstName}
            error={errors?.firstName}
          />

          <FormField
            htmlFor="lastName"
            label="Last Name"
            value={formData.lastName}
            error={errors?.lastName}
          />
        </>
      )}

      <div className="w-full text-center">
        <button
          type="submit"
          name="_action"
          value={action}
          className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          {action === "login" ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </Form>
  );
}
