import { classNames } from "../../utils";

/**
 * Surface container. The `padding` prop controls the **body** padding:
 *   md (default) | sm | none
 */
const Card = ({
  title,
  subtitle,
  action,
  children,
  footer,
  className = "",
  padding = "md",
  as: Component = "section",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  ...props
}) => {
  return (
    <Component className={classNames("ui-card", className)} {...props}>
      {(title || subtitle || action) && (
        <header className={classNames("ui-card-header", headerClassName)}>
          <div className="min-w-0">
            {title && <h2 className="ui-card-title">{title}</h2>}
            {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="ui-card-action">{action}</div>}
        </header>
      )}
      <div
        className={classNames(
          "ui-card-body",
          `ui-card--${padding}-body`,
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer && (
        <footer className={classNames("ui-card-footer", footerClassName)}>
          {footer}
        </footer>
      )}
    </Component>
  );
};

export default Card;
