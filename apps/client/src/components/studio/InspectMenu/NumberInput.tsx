import { useEffect, useRef } from "react";

interface Props extends React.HTMLProps<HTMLInputElement> {
  value?: number;
  updatedValue?: string;
}

export default function NumberInput({ updatedValue, ...rest }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!updatedValue || !ref.current) return;
    ref.current.value = updatedValue;
  }, [updatedValue]);

  return (
    <input
      ref={ref}
      className="border outline-none pl-3 rounded-md w-full bg-neutral-100 focus:border-black"
      onFocus={(e) => e.currentTarget.select()}
      {...rest}
    />
  );
}
