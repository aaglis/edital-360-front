const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-lg flex-shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 transition-all duration-200">
        <span className="uppercase font-bold text-xl">e</span>
      </div>
      <span className="font-bold whitespace-nowrap transition-all duration-200 overflow-hidden group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
        Edital 360
      </span>
    </div>
  );
};

export default Logo;