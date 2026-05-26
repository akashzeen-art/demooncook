export const FooterEn = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 opacity-70">
          <img src="/logo/logo (1).png" alt="On Cook" className="h-10 w-auto object-contain" />
          <span className="oncook-brand text-lg"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</span>
        </div>
        <p className="text-gray-600 text-xs">Made with passion</p>
      </div>
    </footer>
  );
};
