import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import "./Contacto.css";

export default function Contacto() {
  const form = useRef();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "success" o "error"
  const [enviando, setEnviando] = useState(false);

  const enviarCorreo = (e) => {
    e.preventDefault();
    setMensaje("");
    setEnviando(true);

    emailjs
      .sendForm(
        "service_yto9rcb",
        "template_9hhfw76",
        form.current,
        "n6l2cUd_6kOFNvOED"
      )
      .then(
        () => {
          setMensaje("¡Mensaje enviado con éxito! Te responderemos pronto.");
          setTipoMensaje("success");
          form.current.reset();
          setEnviando(false);
          
          // Ocultar mensaje después de 5 segundos
          setTimeout(() => {
            setMensaje("");
            setTipoMensaje("");
          }, 5000);
        },
        (error) => {
          setMensaje("Error al enviar el mensaje. Por favor intenta nuevamente.");
          setTipoMensaje("error");
          setEnviando(false);
          console.error("Error EmailJS:", error);
          
          // Ocultar mensaje de error después de 5 segundos
          setTimeout(() => {
            setMensaje("");
            setTipoMensaje("");
          }, 5000);
        }
      );
  };

  return (
    <section className="contacto-section">
      <div className="contacto-container">
        {/* Información de Contacto */}
        <div className="contacto-info">
          <h2 className="contacto-title">Contacto</h2>
          <p className="contacto-descripcion">
            Si desea realizar una consulta por favor complete el siguiente
            formulario y le responderemos a la brevedad.
          </p>

          <div className="info-item">
            <h3 className="info-subtitle">DIRECCIÓN</h3>
            <p className="info-texto">
              Junín 31, A4400 Salta
              <br />
              Tel: +54 387 400 0000 | Fax: +54 387 400 0030
              <br />
              <a href="mailto:reservas@cadizzhotel.com.ar">
                reservas@cadizzhotel.com.ar
              </a>
            </p>
          </div>

          <div className="info-item">
            <h3 className="info-subtitle">ATENCIÓN COMERCIAL</h3>
            <p className="info-texto">
              Mariana Pascual, Gerencia Comercial
              <br />
              E-mail:{" "}
              <a href="mailto:ventas@cadizzhotel.com.ar">
                ventas@cadizzhotel.com.ar
              </a>
            </p>
          </div>

          <div className="info-item">
            <h3 className="info-subtitle">¿Querés trabajar con nosotros?</h3>
            <p className="info-texto">
              <a href="mailto:rrhh@cadizzhotel.com.ar">
                rrhh@cadizzhotel.com.ar
              </a>
            </p>
          </div>


          <div className="info-item">
            <h3 className="info-subtitle">WhatsApp de reservas</h3>
            <p className="info-texto">
              <a 
                href="https://wa.me/5493874774654" 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                + 54 387 4774654
              </a>
              <br />
              <small>* Lunes a Viernes de 8:00 a 19:00 | Sábados de 9:00 a 13:00</small>
            </p>
          </div>

          {/* Mapa */}
          <div className="contacto-mapa">
            <iframe
              title="Ubicación Hotel Cadizz"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.2468292582213!2d-65.41105632468549!3d-24.790759377965736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc2c3e764c4f1%3A0x5b5b76031b05b49!2sJunin%2031%2C%20A4400%20Salta!5e0!3m2!1ses!2sar!4v1707512345678!5m2!1ses!2sar"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "15px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div className="contacto-form-wrapper">
          <div className="auth-card">
            <h3 className="form-title">Envíanos un mensaje</h3>
            <p className="form-subtitle">
              Completa el formulario y te contactaremos pronto
            </p>

            {mensaje && (
              <div className={`mensaje-alerta ${tipoMensaje}`}>
                {mensaje}
              </div>
            )}

            <form ref={form} onSubmit={enviarCorreo} className="auth-form">
              <div className="form-group">
                <label htmlFor="user_name">Tu nombre</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Juan Pérez"
                  required
                  disabled={enviando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_email">Tu correo</label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="tu@email.com"
                  required
                  disabled={enviando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Escribe tu consulta aquí..."
                  rows="5"
                  required
                  disabled={enviando}
                />
              </div>

              <button 
                type="submit" 
                className="auth-submit"
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}