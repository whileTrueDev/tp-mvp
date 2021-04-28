import { Chip, withStyles } from '@material-ui/core';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default withStyles((theme) => {
  const color = getRandomColor();
  return ({
    root: {
      margin: theme.spacing(0, 0.5, 0.5, 0),
      backgroundColor: color,
      color: theme.palette.getContrastText(color),
    },
  });
})(Chip);
