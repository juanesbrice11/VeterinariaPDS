'use client'

export default function Footer() {
  return (
    <footer className="bg-orange-50 py-4 px-10 flex justify-between items-center shadow-sm border-t mt-auto">
      <div className="text-black">
        © 2025 Fluffy Paws. Todos los derechos reservados.
      </div>
      <div className="flex space-x-4">
        <a href="#" className="text-black hover:underline">Términos y condiciones</a>
        <a href="#" className="text-black hover:underline">Política de privacidad</a>
      </div>
    </footer>
  );
}
