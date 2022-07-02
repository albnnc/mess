/** @jsx h */
import { h, VNode } from "preact";
import { useContext } from "preact/hooks";
import { Head, HEAD_CONTEXT } from "$fresh/runtime.ts";

export interface SxInjectorProps {
  hash: string;
  children: string;
}

export function SxInjector(props: SxInjectorProps) {
  return typeof document === "undefined" ? (
    <ServerSxInjector {...props} />
  ) : (
    <ClientSxInjector {...props} />
  );
}

function ServerSxInjector({ hash, children }: SxInjectorProps) {
  const context = useContext(HEAD_CONTEXT);
  if (
    context.some(
      (v) =>
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        (v as VNode<Record<PropertyKey, unknown>>).props["data-hash"] === hash
    )
  ) {
    return null;
  }
  return (
    <Head>
      <style data-hash={hash}>{children}</style>
    </Head>
  );
}

function ClientSxInjector({ hash, children }: SxInjectorProps) {
  if (
    !Array.from(document.head.getElementsByTagName("style")).some(
      (v) => v.getAttribute("data-hash") === hash
    )
  ) {
    const el = document.createElement("style");
    el.setAttribute("data-hash", hash);
    el.innerHTML = children;
    document.head.appendChild(el);
  }
  return null;
}
