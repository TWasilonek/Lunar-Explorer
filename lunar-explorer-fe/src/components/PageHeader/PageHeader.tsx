type Props = {
  title: string;
};

export const PageHeader = ({ title }: Props) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl">{title}</h1>
    </header>
  );
};
