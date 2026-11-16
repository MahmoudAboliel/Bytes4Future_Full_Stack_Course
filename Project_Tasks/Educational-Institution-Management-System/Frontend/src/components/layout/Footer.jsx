/** Simple application footer rendered at the end of every page. */
const Footer = () => (
  <footer className="border-t border-border bg-white/70 px-4 py-4 sm:px-6">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 text-xs text-muted sm:flex-row">
      <p>إديومس — منصة إدارة المؤسسة التعليمية</p>
      <p className="ltr">© {new Date().getFullYear()} EDUMS</p>
    </div>
  </footer>
);

export default Footer;
