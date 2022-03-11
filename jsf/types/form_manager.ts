import { StateSetter } from "../deps.ts";
import { FormManagerOptions } from "./form_manager_options.ts";
import { Validity } from "./validity.ts";

export interface FormManager<T = unknown> {
  options: FormManagerOptions<T>;

  value: T;
  setValue: StateSetter<T>;

  validity: Validity;
  extendValidity: (validity: Validity | Promise<Validity>) => Promise<void>;

  valid: boolean;
  submitted: boolean;

  wait: () => Promise<void>;
  submit: () => Promise<T>;
  validate: (value: T) => Promise<boolean>;
}
