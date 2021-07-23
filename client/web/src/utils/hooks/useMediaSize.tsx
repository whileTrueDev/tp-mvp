import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function useMediaSize(): {
  isMobile: boolean,
  isDownXs: boolean
  } {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));

  return {
    isMobile,
    isDownXs,
  };
}
