import {
  SiCoffeescript,
  SiGithub,
  SiGmail,
  SiLinkedin,
  SiTwitter,
} from "react-icons/si";
import { Tooltip } from "react-tooltip";

const toolTipStyles = {
  backgroundColor: "#e5e5d5",
  fontFamily: "'Montserrat', sans-serif",
  color: "#35393C",
  fontWeight: 600,
  fontSize: "12px",
};

export const Footer = () => {
  return (
    <footer className="extension-footer">
      <div className="contact-colab-links">
        <span>
          Developed by <span id="name-highlight">Matias Arroyo</span>
        </span>
      </div>
      <div className="contact-links">
        <a
          data-tooltip-id="tooltip"
          data-tooltip-content="Dejale una estrellita al repo ;)"
          href="https://github.com/matiasarroyo1978/PrecioDolar"
          target="_blank"
        >
          <SiGithub />
        </a>
        <a
          data-tooltip-id="tooltip"
          data-tooltip-content="Conectemos en LinkedIn :)"
          href="https://www.linkedin.com/in/matias-arroyo19/"
          target="_blank"
        >
          <SiLinkedin />
        </a>
        <a
          data-tooltip-id="tooltip"
          data-tooltip-content="Seguime en Twitter!"
          href="https://twitter.com/arroyomatias19"
          target="_blank"
        >
          <SiTwitter />
        </a>
        <a
          data-tooltip-id="tooltip"
          data-tooltip-content="Invitame un cafecito :D"
          href="https://cafecito.app/matt_arr"
          target="_blank"
        >
          <SiCoffeescript />
        </a>
        <a
          data-tooltip-id="tooltip"
          data-tooltip-content="Si tenés alguna sugerencia, este es mi mail :)"
          href="mailto:arroyomatias19@gmail.com"
          target="_blank"
        >
          <SiGmail />
        </a>
      </div>
      <Tooltip
        id="tooltip"
        opacity={1}
        border={"1px solid #1f2027"}
        classNameArrow="tooltip-arrow"
        style={toolTipStyles}
      />
    </footer>
  );
};
