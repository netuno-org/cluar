import { theme } from "./theme";


const styles = colorMode => {
    const { backgroundColor, textColor, primaryColor } = theme[colorMode];
  
    return {
      body: {
        backgroundColor,
        color: textColor
      },
      paragraph: {
        color: textColor
      },
      title: {
        color: primaryColor
      }
    };
  };

export default styles;