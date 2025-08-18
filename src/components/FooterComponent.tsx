import Logo from "./Logo";

const FooterComponent = () => {
    return (
      <footer className="bg-gray-900 text-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Logo />
            <p className="text-xs mt-1">Transformando processos seletivos</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="/sobre" className="hover:underline">Sobre</a>
            <a href="/contato" className="hover:underline">Contato</a>
            <a href="/privacidade" className="hover:underline">Privacidade</a>
          </div>
          <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} Edital 360. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    );
}

export default FooterComponent;