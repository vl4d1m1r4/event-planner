import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { UserForm } from "~/components/form";
import { Layout } from "~/components/layout";
import { getUser, register } from "~/utils/auth.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.sever";

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    firstName: validateName((firstName as string) || ""),
    lastName: validateName((lastName as string) || ""),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 },
    );

  return await register({ email, password, firstName, lastName });
};

export default function Register() {
  const actionData = useActionData();
  const errors = actionData?.errors || {};
  const formError = actionData?.error || "";

  const formData = actionData?.fields || {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <Link to="/login">
          <button className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
            Sign in
          </button>
        </Link>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Events Planner!
        </h2>

        <p className="font-semibold text-slate-300">Log In To Browse Events!</p>
        <UserForm
          action="register"
          formData={formData}
          errors={errors}
          formError={formError}
        />
      </div>
    </Layout>
  );
}
