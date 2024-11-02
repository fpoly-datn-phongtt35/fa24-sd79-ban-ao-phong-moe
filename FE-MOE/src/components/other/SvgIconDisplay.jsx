// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1

import React from "react";

const Feature = ({ icon, title, width, height }) => (
  <img src={icon} alt={title} style={{ width: width, height: height }} />
);

const SvgIconDisplay = ({ icon, title, width = "40px", height = "40px" }) => {
  return <Feature icon={icon} title={title} width={width} height={height} />;
};

export default SvgIconDisplay;
