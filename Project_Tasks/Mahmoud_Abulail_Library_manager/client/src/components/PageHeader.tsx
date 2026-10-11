
interface PageHeaderProps {
    title: string;
    description: string;
}
const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default PageHeader