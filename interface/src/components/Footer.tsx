const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-gray-900 shadow-lg">
      <div className="container-app flex flex-col md:flex-row text-center md:text-left items-center justify-between p-4">
        <div className="flex flex-col gap-1 px-4">
          <p className="text-sm text-green-500 font-semibold">DevBills</p>
          <p className="text-sm text-gray-300">
            © {currentYear} DevBills. Todos os direitos reservados.
          </p>
        </div>
        <div className="px-4">
          <p className="text-sm text-gray-300">
            Desenvolvido por{" "}
            <strong className="text-green-500">Carlos Paula</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
