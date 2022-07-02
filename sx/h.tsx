/** @jsx p */
import {
  ComponentChildren,
  ComponentType,
  Fragment,
  h as p,
  JSX,
} from "preact";
import { SxInjector } from "./sx_injector.tsx";
import { sxToStyle } from "./sx_to_style.ts";

type JSXLibraryManagedAttributes<C, P> = JSX.LibraryManagedAttributes<C, P>;
type JSXIntrinsicAttributes = JSX.IntrinsicAttributes;
type JSXElement = JSX.Element;
type JSXElementClass = JSX.ElementClass;
type JSXElementAttributesProperty = JSX.ElementAttributesProperty;
type JSXElementChildrenAttribute = JSX.ElementChildrenAttribute;
type JSXIntrinsicElements = JSX.IntrinsicElements;

type SxProp = {
  sx?: Record<string, unknown>;
};

type WithConditionalSxProp<P> = "class" extends keyof P
  ? string extends P["class"]
    ? P & SxProp
    : P
  : P;

export declare namespace h {
  export namespace JSX {
    export type LibraryManagedAttributes<C, P> = WithConditionalSxProp<P> &
      JSXLibraryManagedAttributes<C, P>;
    export type IntrinsicAttributes = JSXIntrinsicAttributes;
    export type Element = JSXElement;
    export type ElementClass = JSXElementClass;
    export type ElementAttributesProperty = JSXElementAttributesProperty;
    export type ElementChildrenAttribute = JSXElementChildrenAttribute;
    export type IntrinsicElements = {
      [K in keyof JSXIntrinsicElements]: JSXIntrinsicElements[K] & SxProp;
    };
  }
}

export const h = ((
  Component: ComponentType<Record<string, unknown>>,
  props: Record<string, unknown>,
  ...children: ComponentChildren[]
) => {
  if (props && props.sx && typeof props.sx === "object") {
    const { sx, className, ...rest } = props;
    const { hash, name, style } = sxToStyle(sx);
    return (
      <Fragment>
        <SxInjector hash={hash}>{style}</SxInjector>
        <Component class={className ? `${name} ${className}` : name} {...rest}>
          {children}
        </Component>
      </Fragment>
    );
  }
  return <Component {...props}>{children}</Component>;
}) as typeof p;
