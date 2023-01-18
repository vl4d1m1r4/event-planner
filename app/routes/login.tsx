import { useState, useRef, useEffect } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Link, useActionData, Form } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { FormField } from "~/components/form-field";
import { login, register, getUser } from "~/utils/auth.server";

import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.sever";
import { UserForm } from "~/components/form";

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password },
        form: action,
      },
      { status: 400 },
    );

  return await login({ email, password });
};

export default function Login() {
  const actionData = useActionData();
  const errors = actionData?.errors || {};
  const formError = actionData?.error || "";

  const formData = actionData?.fields || {
    email: "",
    password: "",
  };

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <Link to="/register">
          <button className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
            Sign Up
          </button>
        </Link>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Events Planner!
        </h2>

        <p className="font-semibold text-slate-300">Log In To Browse Events!</p>

        <UserForm
          action="login"
          formData={formData}
          errors={errors}
          formError={formError}
        />
      </div>
    </Layout>
  );
}
