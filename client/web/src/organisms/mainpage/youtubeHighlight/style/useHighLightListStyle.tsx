import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import getPlatformColor from '../../../../utils/getPlatformColor';

export interface StyleProps {
  platform: 'twitch' | 'afreeca',
  isMobile: boolean
}
export const useHighlightListStyle = makeStyles<Theme, StyleProps>((theme: Theme) => (
  createStyles({
    tableWrapper: {
      height: '100%',
      width: '100%',
    },
    searchInputContainer: (props) => {
      const { isMobile, platform } = props;
      const platformColor = getPlatformColor(platform);
      return ({
        width: isMobile ? '100%' : undefined,
        maxWidth: isMobile ? undefined : 240,
        padding: theme.spacing(0, 1.25),
        border: `3px solid ${platformColor}`,
        display: 'inline-block',
        borderRadius: theme.spacing(1),
        '& .inputBase': { width: isMobile ? '100%' : undefined },
        '& .searchIcon': { color: platformColor },
      });
    },
    toolbarContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2),
    },
    customTHeader: (props) => {
      const { platform } = props;
      const platformColor = getPlatformColor(platform);
      return ({
        '& .tr': {
          height: theme.spacing(6),
          backgroundColor: platform === 'afreeca' ? '#e6e9f4' : '#ece3f2',
        },
        '& .th': {
          borderTop: `4px solid ${platformColor}`,
          textAlign: 'left',
          paddingLeft: 32,
          fontSize: 16,
          fontWeight: 'bold',
          color: 'black',
        },
        '& .totalCount': { color: 'grey', fontWeight: 'normal' },
      });
    },
  })
));
