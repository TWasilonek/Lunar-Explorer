import { Chip } from "@nextui-org/react";

type Props = {
  errorMessage: string;
};

export const FormErrorMessage = ({ errorMessage, ...restProps }: Props) => {
  return (
    <Chip
      color="danger"
      radius="sm"
      size="lg"
      classNames={{
        base: "w-full max-w-none py-3 h-auto",
      }}
      {...restProps}
    >
      {errorMessage}
    </Chip>
  );
};
