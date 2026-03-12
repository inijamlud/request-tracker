import { CreateRequestInput, createRequestSchema } from "@/lib/schemas";
import { useState } from "react";

type FieldErrors = Partial<Record<keyof CreateRequestInput, string>>;

export function useRequestForm(initial?: Partial<CreateRequestInput>) {
  const [values, setValues] = useState<Partial<CreateRequestInput>>({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: null,
    tagIds: [],
    ...initial,
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function setValue<K extends keyof CreateRequestInput>(
    key: K,
    value: CreateRequestInput[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const result = createRequestSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const [key, msgs] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        fieldErrors[key as keyof CreateRequestInput] = msgs?.[0];
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  return { values, errors, loading, setLoading, setValue, validate };
}
