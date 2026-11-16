import { RotateCcw, Search } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { classNames, prependOption } from "../../utils";

/**
 * Filter toolbar: a search box plus optional select filters and a reset
 * action. Filters are laid out in a single responsive row.
 */
const Filter = ({
  search,
  onSearchChange,
  searchPlaceholder = "ابحث...",
  filters = [],
  values = {},
  onFilterChange,
  onReset,
  className = "",
  searchInputProps = {},
  filterInputProps = {},
  resetLabel = "إعادة تعيين",
  showResetIcon = true,
  ...props
}) => {
  const hasActiveFilter =
    Boolean(search) ||
    Object.values(values).some((value) => value && value !== "all");

  return (
    <div className={classNames("ui-filter", className)} {...props}>
      <div className="ui-filter-search">
        <Input
          aria-label="بحث"
          size="sm"
          placeholder={searchPlaceholder}
          value={search ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          {...searchInputProps}
          icon={searchInputProps.icon ?? <Search className="h-4 w-4" />}
        />
      </div>

      {filters.map((filter) => (
        <div className="ui-filter-select" key={filter.name}>
          <Input
            aria-label={filter.label}
            as="select"
            size="sm"
            name={filter.name}
            value={values[filter.name] ?? ""}
            onChange={(e) => onFilterChange?.(filter.name, e.target.value)}
            {...filterInputProps[filter.name]}
            options={prependOption(filter.options, {
              value: "",
              label: filter.placeholder || `كل ${filter.label}`,
            })}
          />
        </div>
      ))}

      {onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!hasActiveFilter}
          className="h-9"
        >
          {showResetIcon && <RotateCcw className="h-3.5 w-3.5" />}
          {resetLabel}
        </Button>
      )}
    </div>
  );
};

export default Filter;
