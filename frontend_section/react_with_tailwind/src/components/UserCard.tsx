type CardProps = {
  title: string;
  description: string;
  image: string;
  tag?: string;
};

const UserCard = ({ title, description, image, tag }: CardProps) => {
  return (
    <article
      className="
        flex flex-col gap-3
        rounded-lg border border-slate-200 bg-white p-4
        shadow-sm transition-shadow hover:shadow-md
        dark:border-slate-700 dark:bg-slate-800
        sm:flex-row sm:items-center sm:gap-4
        md:p-6
      "
    >
      <img
        src={image}
        alt={title}
        className="h-20 w-20 rounded-md object-cover sm:rounded-full"
      />
      <div className="flex-1">
        {tag && (
          <span
            className="
              mb-1 inline-block rounded-full
              bg-blue-50 px-2 py-0.5
              text-xs font-medium text-blue-700
              dark:bg-blue-900/40 dark:text-blue-300
            "
          >
            {tag}
          </span>
        )}

        <h3 className="text-base font-bold text-slate-800 sm:text-lg dark:text-slate-100">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </article>
  );
};

export default UserCard;
