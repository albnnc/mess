import { createCustomElement, html, useQuery, useState } from "../deps.ts";
import { theme as systemTheme } from "../../tene/mod.ts";
import { JsfSubmitRequestEvent, theme as jsfTheme } from "../mod.ts";
import "../define.ts";
import "../../tene/define.ts";

const schema = {
  type: "object",
  properties: {
    username: {
      title: "Username",
      type: "string",
    },
    password: {
      title: "Password",
      type: "string",
      minLength: 8,
    },
  },
  required: ["username", "password"],
};

const theme = {
  ...systemTheme,
  ...jsfTheme,
};

const ToneRoot = createCustomElement(() => {
  const [submitCount, setSubmitCount] = useState(0);
  const [form] = useQuery("jsf-form");
  return html`
    <tn-system .theme=${theme}>
      <jsf-form
        .schema=${schema}
        @jsf-submit=${() => {
          setSubmitCount((v) => v + 1);
        }}
      >
        <tn-button
          .type="submit"
          .kind="primary"
          @click=${() => {
            form.dispatchEvent(new JsfSubmitRequestEvent());
          }}
        >
          Submit
        </tn-button>
      </jsf-form>
      <div style="margin-top: 1rem">Submit Count = ${submitCount}</div>
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
