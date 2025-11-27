const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
       <div
        className="relative z-0 min-h-screen py-10 bg-fixed bg-cover bg-[url('/background1.jpg')]"
      >
        {/* content layer above gradient */}
        <div className="relative z-10 max-w-3xl mx-auto px-4">{children}</div>
      </div>
    </>
  );
};

export default layout;
